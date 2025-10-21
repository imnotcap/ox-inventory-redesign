import React, { useCallback, useRef } from 'react';
import { DragSource, InventoryType, Slot, SlotWithItem } from '../../typings';
import { useDrag, useDragDropManager, useDrop } from 'react-dnd';
import { useAppDispatch } from '../../store';
import WeightBar from '../utils/WeightBar';
import { onDrop } from '../../dnd/onDrop';
import { onBuy } from '../../dnd/onBuy';
import { Items } from '../../store/items';
import { canCraftItem, canPurchaseItem, getItemUrl, isSlotWithItem } from '../../helpers';
import { onUse } from '../../dnd/onUse';
import { Locale } from '../../store/locale';
import { onCraft } from '../../dnd/onCraft';
import useNuiEvent from '../../hooks/useNuiEvent';
import { ItemsPayload } from '../../reducers/refreshSlots';
import { closeTooltip, openTooltip } from '../../store/tooltip';
import { openContextMenu } from '../../store/contextMenu';
import { useMergeRefs } from '@floating-ui/react';
import { Rarity } from '../../store/rarity';

interface SlotProps {
  inventoryId: string;
  inventoryType: string;
  inventoryGroups: any;
  item: any;
  onUse?: (item: any) => void;
  canDrop?: (item: any) => boolean;
  style?: React.CSSProperties;
  onCtrlClick?: (item: any) => void; // Add onCtrlClick prop
}

const InventorySlot: React.ForwardRefRenderFunction<HTMLDivElement, SlotProps> = (
  { item, inventoryId, inventoryType, inventoryGroups, onUse, canDrop, style, onCtrlClick },
  ref
) => {
  const manager = useDragDropManager();
  const dispatch = useAppDispatch();
  const timerRef = useRef<number | null>(null);

  const rarityColors = Rarity;
  const rarityKey = (item?.rarity ?? '').toLowerCase();
  const rarityColor = rarityColors[rarityKey];

  const withAlpha = (color: string, alpha: number) => {
    return color.replace(/rgba?\(([^)]+)\)/, (match, contents) => {
      if (!contents) return match;
      const parts = contents.split(',').map((p: string) => p.trim());
      if (parts.length === 3) {
        return `rgba(${parts.join(', ')}, ${alpha})`;
      } else if (parts.length === 4) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
      }
      return match;
    });
  };

  const canDrag = useCallback(() => {
    if (!isSlotWithItem(item, true)) return false;
    if (inventoryType === InventoryType.SHOP) return true;
    return (
      canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) &&
      canCraftItem(item, inventoryType)
    );
  }, [item, inventoryType, inventoryGroups]);

  const [{ isDragging }, drag] = useDrag<DragSource, void, { isDragging: boolean }>(
    () => ({
      type: 'SLOT',
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: () => {
        if (!canDrag()) return null;
        return {
          inventory: inventoryType,
          item: { ...item },
          image: item?.name && `url(${getItemUrl(item) || 'none'})`,
        };
      },
      canDrag,
    }),
    [inventoryType, item, canDrag]
  );

  const [{ isOver, canDrop: isDroppable }, drop] = useDrop<
    DragSource,
    void,
    { isOver: boolean; canDrop: boolean }
  >(
    () => ({
      accept: 'SLOT',
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop: (source) => {
        dispatch(closeTooltip());
        switch (source.inventory) {
          case InventoryType.SHOP:
            onBuy(source, { inventory: inventoryType, item: { ...item } });
            break;
          case InventoryType.CRAFTING:
            onCraft(source, { inventory: inventoryType, item: { ...item } });
            break;
          default:
            onDrop(source, { inventory: inventoryType, item: { ...item } });
            break;
        }
      },
      canDrop: (source) => {
        if (source.inventory === InventoryType.SHOP) return false;
        const baseAllowed =
          (source.item.slot !== item.slot || source.inventory !== inventoryType) &&
          inventoryType !== InventoryType.SHOP &&
          inventoryType !== InventoryType.CRAFTING;
        if (!baseAllowed) return false;
        return canDrop ? canDrop(source.item) : true;
      },
    }),
    [inventoryType, item, canDrop]
  );

  useNuiEvent('refreshSlots', (data: { items?: ItemsPayload | ItemsPayload[] }) => {
    if (!isDragging && !data.items) return;
    if (!Array.isArray(data.items)) return;

    const itemSlot = data.items.find(
      (dataItem) => dataItem.item.slot === item.slot && dataItem.inventory === inventoryId
    );

    if (!itemSlot) return;

    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  const connectRef = (element: HTMLDivElement) => drag(drop(element));

  const handleContext = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (inventoryType !== 'player' || !isSlotWithItem(item)) return;
    dispatch(openContextMenu({ item, coords: { x: event.clientX, y: event.clientY } }));
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    dispatch(closeTooltip());
    if (timerRef.current) clearTimeout(timerRef.current);
    if (event.ctrlKey && isSlotWithItem(item)) {
      if (inventoryType === InventoryType.SHOP && onCtrlClick) {
        onCtrlClick(item); // Call onCtrlClick for shop items
      } else if (inventoryType !== InventoryType.CRAFTING) {
        onDrop({ item: item, inventory: inventoryType });
      }
    } else if (event.altKey && isSlotWithItem(item) && inventoryType === 'player') {
      if (onUse) onUse(item);
    }
  };

  const refs = useMergeRefs([connectRef, ref]);

  return (
    <div
      ref={refs}
      onContextMenu={handleContext}
      onClick={handleClick}
      className="inventory-slot"
      style={{
        borderRadius: '4px',
        padding: '8px',
        border: isOver
          ? '1px dashed rgba(255,255,255,0.4)'
          : '1px solid transparent',
        background: isOver
          ? `
              ${item?.name ? `url(${getItemUrl(item as SlotWithItem)}) center / 5vh no-repeat padding-box,` : ''}
              linear-gradient(45deg, #161616bb, #000000b4) padding-box,
              linear-gradient(90deg, rgba(255,255,255,0.336), rgba(0,0,0,0.589)) border-box
            `
          : rarityColor
          ? `
              ${item?.name ? `url(${getItemUrl(item as SlotWithItem)}) center / 5vh no-repeat padding-box,` : ''}
              linear-gradient(45deg, #161616bb, #000000b4) padding-box,
              linear-gradient(-45deg, rgba(255,255,255,0), ${withAlpha(rarityColor, 1)}) border-box
            `
          : `
              ${item?.name ? `url(${getItemUrl(item as SlotWithItem)}) center / 5vh no-repeat padding-box,` : ''}
              linear-gradient(45deg, #161616bb, #000000b4) padding-box,
              linear-gradient(135deg, rgba(255,255,255,0.336), rgba(0,0,0,0.589)) border-box
            `,
        filter:
          !canPurchaseItem(item, { type: inventoryType, groups: inventoryGroups }) ||
          !canCraftItem(item, inventoryType)
            ? 'brightness(80%) grayscale(100%)'
            : undefined,
        opacity: isDragging ? 0.4 : 1.0,
        boxShadow: isOver
          ? 'inset 0px 0px 40px -20px rgba(255,255,255, 0.1)'
          : rarityColor
          ? `inset 0px 0px 3vh -2vh ${withAlpha(rarityColor, 1)}`
          : 'inset 0px 0px 2vh -1vh rgba(0,0,0, 1)',
        ...style,
      }}
    >
      {isSlotWithItem(item) && (
        <div
          className="item-slot-wrapper"
          onMouseEnter={() => {
            timerRef.current = window.setTimeout(() => {
              dispatch(openTooltip({ item, inventoryType }));
            }, 500) as unknown as number;
          }}
          onMouseLeave={() => {
            dispatch(closeTooltip());
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
          }}
        >
          <div
            className={
              inventoryType === 'player' && item.slot <= 4
                ? 'item-hotslot-header-wrapper'
                : 'item-slot-header-wrapper'
            }
            style={{
              color: `${rarityColor}`,
            }}
          >
            {inventoryType === 'player' && item.slot <= 4 && 
              <div 
              className="inventory-slot-number"
              style={{
                background: rarityColor
                  ? `${withAlpha(rarityColor, 1)}`
                  : `linear-gradient(135deg, rgba(255,255,255,0.336), rgba(0,0,0,0.589))`,
              }}
              >
                {item.slot}
              </div>
            }
            <div className="item-slot-info-wrapper">
              <p>{item.count ? item.count.toLocaleString('en-us') + `x` : ''}</p>
            </div>
            {inventoryType === 'utility' && item.slot <= 4 && (
              <div className="hotbar-slot-header-wrapper">
                <div
                  className="inventory-slot-number"
                  style={{
                    background: rarityColor
                      ? `${withAlpha(rarityColor, 1)}`
                      : `linear-gradient(135deg, rgba(255,255,255,0.336), rgba(0,0,0,0.589))`,
                  }}
                >
                  {item.slot}
                </div>
              </div>
            )}
            <div className="inventory-slot-rarity">{item.rarity}</div>
          </div>
          <div>
            {inventoryType === 'shop' && item?.price !== undefined && (
              <>
                {item?.currency !== 'money' && item.currency !== 'black_money' && item.price > 0 && item.currency ? (
                  <div className="item-slot-currency-wrapper">
                    <img
                      src={item.currency ? getItemUrl(item.currency) : 'none'}
                      alt="item-image"
                      style={{
                        imageRendering: '-webkit-optimize-contrast',
                        height: 'auto',
                        width: '2vh',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                      }}
                    />
                    <p>{item.price.toLocaleString('en-us')}</p>
                  </div>
                ) : (
                  <>
                    {item.price > 0 && (
                      <div
                        className="item-slot-price-wrapper"
                        style={{ color: item.currency === 'money' || !item.currency ? '#2ECC71' : '#E74C3C' }}
                      >
                        <p>
                          {Locale.$ || '$'}
                          {item.price.toLocaleString('en-us')}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            <div className="inventory-slot-label-box">
              <div className="inventory-slot-label-text">
                {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
              </div>
              <p>
                {item.weight > 0
                  ? item.weight >= 1000
                    ? `${(item.weight / 1000).toLocaleString('en-us', {
                        minimumFractionDigits: 2,
                      })}kg `
                    : `${item.weight.toLocaleString('en-us', {
                        minimumFractionDigits: 0,
                      })}g `
                  : ''}
              </p>
            </div>
          </div>
        </div>
      )}
      {inventoryType !== 'shop' && item?.durability !== undefined && (
        <WeightBar percent={item.durability} durability />
      )}
    </div>
  );
};

export default React.memo(React.forwardRef(InventorySlot));