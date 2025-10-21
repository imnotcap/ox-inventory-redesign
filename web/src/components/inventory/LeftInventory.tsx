import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectLeftInventory, selectBackpackInventory } from '../../store/inventory';
import React, { useState } from 'react';
import WeightBar from '../utils/WeightBar';
import { getTotalWeight } from '../../helpers';
import { AnimatePresence, motion } from 'framer-motion';

const LeftInventory: React.FC = () => {
  const leftInventory = useAppSelector(selectLeftInventory);
  const backpackInventory = useAppSelector(selectBackpackInventory);
  const [backpackVisible, setBackpackVisible] = useState(false);

  // Calculate weight for backpack
  const backpackWeight =
    backpackInventory && backpackInventory.maxWeight !== undefined
      ? Math.floor(getTotalWeight(backpackInventory.items) * 1000) / 1000
      : 0;

  return (
    <div className="left-inventory">
      <AnimatePresence>
        <motion.div
          key="left-inventory-motion"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}>

      <InventoryGrid inventory={leftInventory} />
      {backpackInventory?.slots > 0 && (
        <div
          className="inventory-grid-wrapper"
          style={{
            height: 'fit-content',
            cursor: 'pointer',
            marginTop: '1vh',
            padding: 0,
            background: '',
          }}
          onClick={() => setBackpackVisible((v) => !v)}
        >
          <div className="inventory-grid-header-wrapper" style={{ padding: '1vh 2.5vh 0 2.5vh' }}>
            <div className="inventory-grid-header-wrapper2">
              <h1>{backpackInventory.label || 'Backpack'}</h1>
            </div>
            <div className="inventory-grid-header-weight">
              {backpackInventory.maxWeight && (
                <p>
                  <i className="fa-light fa-weight-hanging"></i> {backpackWeight / 1000} / {backpackInventory.maxWeight / 1000}kg
                  {backpackVisible ? (
                    <i className="fas fa-angle-up"></i>
                  ) : (
                    <i className="fas fa-angle-down"></i>
                  )}
                </p>
              )}
            </div>
          </div>
          <div style={{ padding: '0 2.5vh 0 2.5vh' }}>
            <WeightBar percent={backpackInventory.maxWeight ? (backpackWeight / backpackInventory.maxWeight) * 100 : 0} />
          </div>
          <div
            className={`backpack-collapse${backpackVisible ? ' open' : ''}`}
            style={{
              maxHeight: backpackVisible ? 400 : 0,
              opacity: backpackVisible ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
            >
            <div className="backpack-wrapper">
              <InventoryGrid inventory={backpackInventory} hideHeader noWrapper />
            </div>

          </div>
        </div>
      )}
      </motion.div>
    </AnimatePresence>
    </div>
  );
};

export default LeftInventory;