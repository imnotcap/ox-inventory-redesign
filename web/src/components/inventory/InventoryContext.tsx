import React from 'react';
import { Menu, MenuItem } from '../utils/menu/Menu';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { onUse } from '../../dnd/onUse';
import { onGive } from '../../dnd/onGive';
import { onDrop } from '../../dnd/onDrop';
import { Items } from '../../store/items';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { isSlotWithItem } from '../../helpers';
import { setClipboard } from '../../utils/setClipboard';

interface DataProps {
  action: string;
  component?: string;
  slot?: number;
  serial?: string;
  id?: number;
}

interface InventoryContextProps {
  setSplitItem: React.Dispatch<React.SetStateAction<{ item: any; amount: number } | null>>;
}

interface Button {
  label: string;
  index: number;
  group?: string;
}

interface Group {
  groupName: string | null;
  buttons: ButtonWithIndex[];
}

interface ButtonWithIndex extends Button {
  index: number;
}

interface GroupedButtons extends Array<Group> { }

const InventoryContext: React.FC<InventoryContextProps> = ({ setSplitItem }) => {
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();
  const contextMenu = useAppSelector((state) => state.contextMenu);
  const item = contextMenu.item;

  const handleClick = (data: DataProps) => {
    if (!item) return;

    switch (data.action) {
      case 'use':
        onUse({ name: item.name, slot: item.slot });
        break;
      case 'give':
        onGive({ name: item.name, slot: item.slot });
        break;
      case 'drop':
        isSlotWithItem(item) && onDrop({ item, inventory: 'player' });
        break;
      case 'split':
        setSplitItem({ item, amount: itemAmount });
        break;
      case 'remove':
        fetchNui('removeComponent', { component: data.component, slot: data.slot });
        break;
      case 'removeAmmo':
        fetchNui('removeAmmo', item.slot);
        break;
      case 'copy':
        setClipboard(data.serial || '');
        break;
      case 'custom':
        fetchNui('useButton', { id: (data.id || 0) + 1, slot: item.slot });
        break;
    }
  };

  const groupButtons = (buttons: any): GroupedButtons => {
    return buttons.reduce((groups: Group[], button: Button, index: number) => {
      if (button.group) {
        const groupIndex = groups.findIndex((group) => group.groupName === button.group);
        if (groupIndex !== -1) {
          groups[groupIndex].buttons.push({ ...button, index });
        } else {
          groups.push({
            groupName: button.group,
            buttons: [{ ...button, index }],
          });
        }
      } else {
        groups.push({
          groupName: null,
          buttons: [{ ...button, index }],
        });
      }
      return groups;
    }, []);
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.valueAsNumber =
      isNaN(event.target.valueAsNumber) || event.target.valueAsNumber < 0 ? 0 : Math.floor(event.target.valueAsNumber);
    dispatch(setItemAmount(event.target.valueAsNumber));
  };

  return (
    <Menu>
      <MenuItem onClick={() => handleClick({ action: 'use' })} label={Locale.ui_use || 'Brug'} />
      <MenuItem onClick={() => handleClick({ action: 'give' })} label={Locale.ui_give || 'Giv'} />

      {item && item.count > 1 && (
        <MenuItem onClick={() => handleClick({ action: 'split' })} label={Locale.ui_split || 'Split'} />
      )}

      {item && item.metadata?.ammo > 0 && (
        <MenuItem onClick={() => handleClick({ action: 'removeAmmo' })} label={Locale.ui_remove_ammo} />
      )}

      {item && item.metadata?.serial && (
        <MenuItem onClick={() => handleClick({ action: 'copy', serial: item?.metadata?.serial })} label={Locale.ui_copy} />
      )}

      {item && item.metadata?.components?.length > 0 && (
        <Menu label={Locale.ui_removeattachments}>
          {item?.metadata?.components.map((component: string, index: number) => (
            <MenuItem
              key={index}
              onClick={() => handleClick({ action: 'remove', component, slot: item.slot })}
              label={Items[component]?.label || ''}
            />
          ))}
        </Menu>
      )}

      {((item && item.name && Items[item.name]?.buttons?.length) || 0) > 0 && (
        <>
          {item && item.name && groupButtons(Items[item.name]?.buttons).map((group: Group, index: number) => (
            <React.Fragment key={index}>
              {group.groupName ? (
                <Menu label={group.groupName}>
                  {group.buttons.map((button: Button) => (
                    <MenuItem
                      key={button.index}
                      onClick={() => handleClick({ action: 'custom', id: button.index })}
                      label={button.label}
                    />
                  ))}
                </Menu>
              ) : (
                group.buttons.map((button: Button) => (
                  <MenuItem
                    key={button.index}
                    onClick={() => handleClick({ action: 'custom', id: button.index })}
                    label={button.label}
                  />
                ))
              )}
            </React.Fragment>
          ))}
        </>
      )}


      <MenuItem onClick={() => handleClick({ action: 'drop' })} label={Locale.ui_drop || 'Smid'} />
    </Menu>
  );
};

export default InventoryContext;