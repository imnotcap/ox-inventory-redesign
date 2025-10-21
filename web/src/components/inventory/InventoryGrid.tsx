import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory, InventoryType } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';

const PAGE_SIZE = 30;
const MAX_SHOP_SLOTS = 8;

interface InventoryGridProps {
  inventory: Inventory;
  hideHeader?: boolean;
  hideExtras?: boolean;
  noWrapper?: boolean;
  onCtrlClick?: (item: ShopItem) => void; // Add onCtrlClick prop
}

interface ShopItem {
  slot: number;
  name: string;
  price?: number;
  metadata?: { label?: string };
  image?: string;
  currency?: string;
  weight?: number;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({
  inventory,
  hideHeader,
  hideExtras,
  noWrapper,
  onCtrlClick, // Destructure new prop
}) => {
  const weight = useMemo(
    () =>
      inventory.maxWeight !== undefined
        ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000
        : 0,
    [inventory.maxWeight, inventory.items]
  );

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, [entry]);

  const slotsToShow = useMemo(() => {
    if (inventory.type === InventoryType.SHOP) {
      return inventory.items.slice(0, MAX_SHOP_SLOTS);
    }
    return inventory.items;
  }, [inventory.items, inventory.type]);

  const paginatedItems = slotsToShow.slice(
    0,
    Math.min((page + 1) * PAGE_SIZE, slotsToShow.length)
  );

  const content = (
    <>
      {!hideHeader && (
        <div>
          <div className="inventory-grid-header-wrapper">
            <div className="inventory-grid-header-wrapper2">
              <h1>{inventory.label || 'Drop'}</h1>
            </div>

            {!hideExtras && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1vh',
                }}>
                <input
                style={{ border: '1px solid rgba(255,255,255,0.2)', height: '2.5vh', fontSize: '1vh', display: 'flex', alignItems: 'center' }}
                  type="search"
                  placeholder="Søg item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <i className="far fa-search"></i>
                </div>
                <div className="inventory-grid-header-weight">
                  {inventory.maxWeight && (
                    <p>
                      <i className="fa-light fa-weight-hanging"></i>{' '}
                      {weight / 1000} / {inventory.maxWeight / 1000}kg
                    </p>
                  )}
                </div>
                
              </div>
            )}
          </div>

          {!hideExtras && (
            <WeightBar
              percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0}
            />
          )}
        </div>
      )}

      <div
        className="inventory-grid-container"
        ref={containerRef}
        style={{ paddingRight: '8px' }}
      >
        {paginatedItems.map((item, index) => {
          const matches = item?.name?.toLowerCase().includes(searchQuery.toLowerCase());
          return (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={index === paginatedItems.length - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
              onCtrlClick={onCtrlClick} // Pass onCtrlClick to InventorySlot
              style={{
                opacity: searchQuery && !matches ? 0.25 : 1,
                transition: 'opacity 0.2s ease',
              }}
            />
          );
        })}
      </div>
    </>
  );

  if (noWrapper) {
    return content;
  }

  return (
    <div
      className="inventory-grid-wrapper"
      style={{ pointerEvents: isBusy ? 'none' : 'auto' }}
    >
      {content}
    </div>
  );
};

export default InventoryGrid;