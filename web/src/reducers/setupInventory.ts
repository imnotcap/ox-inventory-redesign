import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { getItemData, itemDurability } from '../helpers';
import { Items } from '../store/items';
import { Inventory, State } from '../typings';

export const setupInventoryReducer: CaseReducer<
  State,
  PayloadAction<{
    leftInventory?: Inventory;
    rightInventory?: Inventory;
    backpackInventory?: Inventory;
  }>
> = (state, action) => {
  const { leftInventory, rightInventory } = action.payload;
  const curTime = Math.floor(Date.now() / 1000);

  if (leftInventory)
    state.leftInventory = {
      ...leftInventory,
      items: Array.from(Array(leftInventory.slots), (_, index) => {
        const rawItem =
          Object.values(leftInventory.items).find((i) => i?.slot === index + 1) || {
            slot: index + 1,
          };

        if (!rawItem.name) return rawItem;

        if (typeof Items[rawItem.name] === 'undefined') {
          getItemData(rawItem.name);
        }

        return {
          ...rawItem,
          durability: itemDurability(rawItem.metadata, curTime),
        };
      }),
    };

  if (action.payload.backpackInventory) {
    const backpackInventory = action.payload.backpackInventory;
    state.backpackInventory = {
      ...backpackInventory,
      items: Array.from(Array(backpackInventory.slots), (_, index) => {
        const rawItem =
          Object.values(backpackInventory.items).find((i) => i?.slot === index + 1) || {
            slot: index + 1,
          };

        if (!rawItem.name) return rawItem;

        if (typeof Items[rawItem.name] === 'undefined') {
          getItemData(rawItem.name);
        }

        return {
          ...rawItem,
          durability: itemDurability(rawItem.metadata, curTime),
        };
      }),
    };
  }

  if (rightInventory) {
    state.rightInventory = {
      ...rightInventory,
      items: Array.from(Array(rightInventory.slots), (_, index) => {
        const rawItem =
          Object.values(rightInventory.items).find((i) => i?.slot === index + 1) || {
            slot: index + 1,
          };

        if (!rawItem.name) return rawItem;

        if (typeof Items[rawItem.name] === 'undefined') {
          getItemData(rawItem.name);
        }

        return {
          ...rawItem,
          durability: itemDurability(rawItem.metadata, curTime),
        };
      }),
    };
  }

  state.shiftPressed = false;
  state.isBusy = false;
};
