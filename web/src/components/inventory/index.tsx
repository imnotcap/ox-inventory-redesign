import React, { useState } from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import { useAppDispatch } from '../../store';
import { refreshSlots, setAdditionalMetadata, setupInventory } from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import type { Inventory as InventoryProps } from '../../typings';
import RightInventory from './RightInventory';
import LeftInventory from './LeftInventory';
import Tooltip from '../utils/Tooltip';
import { closeTooltip } from '../../store/tooltip';
import InventoryContext from './InventoryContext';
import { closeContextMenu } from '../../store/contextMenu';
import Fade from '../utils/transitions/Fade';
import UsefulControls from './UsefulControls';
import InventoryHotbar from './InventoryHotbar';
import InventoryPanelSwitcher from './InventoryPanelSwitcher';
import InventoryUtils from './InventoryUtils';
import SplitControl from './SplitControl';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [splitItem, setSplitItem] = useState<{ item: any; amount: number } | null>(null);
  const [activePanel, setActivePanel] = useState<'utils' | 'inventory'>('inventory');
  const dispatch = useAppDispatch();

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    dispatch(closeContextMenu());
    dispatch(closeTooltip());
  });
  useExitListener(setInventoryVisible);

  useNuiEvent<{ leftInventory?: InventoryProps; rightInventory?: InventoryProps }>(
    'setupInventory',
    (data) => {
      dispatch(setupInventory(data));
      !inventoryVisible && setInventoryVisible(true);
    }
  );

  useNuiEvent('refreshSlots', (data) => {
    dispatch(refreshSlots(data));
  });
  useNuiEvent('displayMetadata', (data: Array<{ metadata: string; value: string }>) =>
    dispatch(setAdditionalMetadata(data))
  );

  return (
    <>
      <Fade in={inventoryVisible}>
        <div className="inventory-wrapper">
          {/* <InventoryPanelSwitcher activePanel={activePanel} setActivePanel={setActivePanel} /> */}

          <LeftInventory />

          {splitItem && (
  <SplitControl
    item={splitItem.item}
    amount={splitItem.amount}
    infoVisible={infoVisible}
    setInfoVisible={setInfoVisible}
  />
)}

          {/* {activePanel === 'utils' && <InventoryUtils />} */}
          {activePanel === 'inventory' && <RightInventory />}

          <Tooltip />
          <InventoryContext setSplitItem={setSplitItem} />
          <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />

          <button className="useful-controls-button" onClick={() => setInfoVisible(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 524 524">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
          </button>
        </div>
      </Fade>
      <InventoryHotbar />
    </>
  );
};

export default Inventory;
