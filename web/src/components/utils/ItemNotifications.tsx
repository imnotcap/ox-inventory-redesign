import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import useNuiEvent from '../../hooks/useNuiEvent';
import useQueue from '../../hooks/useQueue';
import { Locale } from '../../store/locale';
import { getItemUrl } from '../../helpers';
import { SlotWithItem } from '../../typings';
import { Items } from '../../store/items';
import Fade from './transitions/Fade';
import { Rarity } from '../../store/rarity';

interface ItemNotificationProps {
  item: SlotWithItem;
  text: string;
}

export const ItemNotificationsContext = React.createContext<{
  add: (item: ItemNotificationProps) => void;
} | null>(null);

export const useItemNotifications = () => {
  const itemNotificationsContext = useContext(ItemNotificationsContext);
  if (!itemNotificationsContext) throw new Error(`ItemNotificationsContext undefined`);
  return itemNotificationsContext;
};

const ItemNotification = React.forwardRef(
  (props: { item: ItemNotificationProps; style?: React.CSSProperties }, ref: React.ForwardedRef<HTMLDivElement>) => {
    const slotItem = props.item.item;

    const rarityColors = Rarity
    const rarityKey = (slotItem?.rarity ?? 'common').toLowerCase();
    const rarityColor = rarityColors[rarityKey];

    const withAlpha = (color: string, alpha: number) => {
      return color.replace(/rgba?\(([^)]+)\)/, (match, contents) => {
        if (!contents) return match; // <-- guard against undefined
        const parts = contents.split(',').map((p: string) => p.trim());
        if (parts.length === 3) {
          return `rgba(${parts.join(', ')}, ${alpha})`;
        } else if (parts.length === 4) {
          return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
        }
        return match;
      });
    };


    return (
      <div
        className="item-notification-item-box"
        style={{
          border: '1px solid transparent', // gradient border area
          background: `${slotItem?.name ? `url(${getItemUrl(slotItem as SlotWithItem)}) center / 50% 50% no-repeat padding-box,` : ''}
                    linear-gradient(45deg, #161616bb, #000000b4) padding-box,
                    linear-gradient(-45deg, rgba(255,255,255,0), ${withAlpha(rarityColor, 1)}) border-box
                  `,
          boxShadow: `inset 0px 0px 3vh -2vh ${withAlpha(rarityColor, 1)}`
        }}
        ref={ref}
      >
        <div className="item-slot-wrapper">
          <div className="item-notification-action-box">

            <p>{props.item.text}</p>
          </div>
          <div className="inventory-slot-label-box">
            <div className="inventory-slot-label-text">{slotItem.label || Items[slotItem.name]?.label}</div>
          </div>
        </div>
      </div>
    );
  }
);

export const ItemNotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const queue = useQueue<{
    id: number;
    item: ItemNotificationProps;
    ref: React.RefObject<HTMLDivElement>;
  }>();

  const add = (item: ItemNotificationProps) => {
    const ref = React.createRef<HTMLDivElement>();
    const notification = { id: Date.now(), item, ref: ref };

    queue.add(notification);

    const timeout = setTimeout(() => {
      queue.remove();
      clearTimeout(timeout);
    }, 2500);
  };

  useNuiEvent<[item: SlotWithItem, text: string, count?: number]>('itemNotify', ([item, text, count]) => {
    add({ item: item, text: count ? `${Locale[text]} ${count}x` : `${Locale[text]}` });
  });

  return (
    <ItemNotificationsContext.Provider value={{ add }}>
      {children}
      {createPortal(
        <TransitionGroup className="item-notification-container">
          {queue.values.map((notification, index) => (
              <Fade key={`item-notification-${index}`}>
                <ItemNotification item={notification.item} ref={notification.ref}/>
              </Fade>
          ))}
        </TransitionGroup>,
        document.body
      )}
    </ItemNotificationsContext.Provider>
  );
};
