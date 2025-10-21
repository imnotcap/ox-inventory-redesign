import { Inventory, InventoryType, ItemData, Slot, SlotWithItem, State } from '../typings';
import { isEqual } from 'lodash';
import { store } from '../store';
import { Items } from '../store/items';
import { imagepath } from '../store/imagepath';
import { fetchNui } from '../utils/fetchNui';

export const canPurchaseItem = (item: Slot, inventory: { type: Inventory['type']; groups: Inventory['groups'] }) => {
  if (inventory.type !== 'shop' || !isSlotWithItem(item)) return true;

  if (item.count !== undefined && item.count === 0) return false;

  if (item.grade === undefined || !inventory.groups) return true;

  const leftInventory = store.getState().inventory.leftInventory;

  // Shop requires groups but player has none
  if (!leftInventory.groups) return false;

  const reqGroups = Object.keys(inventory.groups);

  if (Array.isArray(item.grade)) {
    for (let i = 0; i < reqGroups.length; i++) {
      const reqGroup = reqGroups[i];

      if (leftInventory.groups[reqGroup] !== undefined) {
        const playerGrade = leftInventory.groups[reqGroup];
        for (let j = 0; j < item.grade.length; j++) {
          const reqGrade = item.grade[j];

          if (playerGrade === reqGrade) return true;
        }
      }
    }

    return false;
  } else {
    for (let i = 0; i < reqGroups.length; i++) {
      const reqGroup = reqGroups[i];
      if (leftInventory.groups[reqGroup] !== undefined) {
        const playerGrade = leftInventory.groups[reqGroup];

        if (playerGrade >= item.grade) return true;
      }
    }

    return false;
  }
};

export const canCraftItem = (item: Slot, inventoryType: string) => {
  if (!isSlotWithItem(item) || inventoryType !== 'crafting') return true;
  if (!item.ingredients) return true;
  const leftInventory = store.getState().inventory.leftInventory;
  const backpackInventory = store.getState().inventory.backpackInventory;
  const ingredientItems = Object.entries(item.ingredients);

  const remainingItems = ingredientItems.filter((ingredient) => {
    const [itemName, count] = [ingredient[0], ingredient[1]];
    const globalItem = Items[itemName];

    let totalCount = 0;

    // Count in leftInventory
    leftInventory.items.forEach((playerItem) => {
      if (isSlotWithItem(playerItem) && playerItem.name === itemName) {
        totalCount += playerItem.count ?? 1;
      }
    });

    // Count in backpackInventory
    if (backpackInventory && backpackInventory.items) {
      backpackInventory.items.forEach((playerItem) => {
        if (isSlotWithItem(playerItem) && playerItem.name === itemName) {
          totalCount += playerItem.count ?? 1;
        }
      });
    }

    if (count >= 1) {
      if (globalItem && totalCount >= count) return false;
    }

    const hasItem =
      leftInventory.items.find((playerItem) => {
        if (isSlotWithItem(playerItem) && playerItem.name === itemName) {
          if (count < 1) {
            if (playerItem.metadata?.durability >= count * 100) return true;
            return false;
          }
        }
      }) ||
      (backpackInventory &&
        backpackInventory.items.find((playerItem) => {
          if (isSlotWithItem(playerItem) && playerItem.name === itemName) {
            if (count < 1) {
              if (playerItem.metadata?.durability >= count * 100) return true;
              return false;
            }
          }
        }));

    return !hasItem;
  });

  return remainingItems.length === 0;
};

export const isSlotWithItem = (slot: Slot, strict: boolean = false): slot is SlotWithItem =>
  (slot.name !== undefined && slot.weight !== undefined) ||
  (strict && slot.name !== undefined && slot.count !== undefined && slot.weight !== undefined);

export const canStack = (sourceSlot: Slot, targetSlot: Slot) =>
  sourceSlot.name === targetSlot.name && isEqual(sourceSlot.metadata, targetSlot.metadata);

export const findAvailableSlot = (item: Slot, data: ItemData, items: Slot[]) => {
  if (!data.stack) return items.find((target) => target.name === undefined);

  const stackableSlot = items.find((target) => target.name === item.name && isEqual(target.metadata, item.metadata));

  return stackableSlot || items.find((target) => target.name === undefined);
};

export const getTargetInventory = (
  state: State,
  sourceType: Inventory['type'],
  targetType?: Inventory['type']
): { sourceInventory: Inventory; targetInventory: Inventory } => {
  let sourceInventory: Inventory;
  let targetInventory: Inventory;

  if (sourceType === InventoryType.PLAYER) {
    sourceInventory = state.leftInventory;
  } else if (sourceType === InventoryType.BACKPACK) {
    sourceInventory = state.backpackInventory;
  } else {
    sourceInventory = state.rightInventory;
  }

  if (targetType) {
    if (targetType === InventoryType.PLAYER) {
      targetInventory = state.leftInventory;
    } else if (targetType === InventoryType.BACKPACK) {
      targetInventory = state.backpackInventory;
    } else {
      targetInventory = state.rightInventory;
    }
  } else {
    if (sourceType === InventoryType.PLAYER) {
      targetInventory = state.rightInventory;
    } else if (sourceType === InventoryType.BACKPACK) {
      targetInventory = state.leftInventory;
    } else {
      targetInventory = state.leftInventory;
    }
  }

  return { sourceInventory, targetInventory };
};

export const itemDurability = (metadata: any, curTime: number) => {
  // sorry dunak
  // it's ok linden i fix inventory
  if (metadata?.durability === 0) return;
  if (!metadata?.durability) return;

  let durability = metadata.durability;

  if (durability > 100 && metadata.degrade)
    durability = ((metadata.durability - curTime) / (60 * metadata.degrade)) * 100;

  if (durability < 0) durability = 0;

  return durability;
};

export const getTotalWeight = (items: Inventory['items']) =>
  items.reduce((totalWeight, slot) => (isSlotWithItem(slot) ? totalWeight + slot.weight : totalWeight), 0);

export const isContainer = (inventory: Inventory) => inventory.type === InventoryType.CONTAINER;

export const getItemData = async (itemName: string) => {
  const resp: ItemData | null = await fetchNui('getItemData', itemName);

  if (resp?.name) {
    Items[itemName] = resp;
    return resp;
  }
};

export const getItemUrl = (item: string | SlotWithItem) => {
  const isObj = typeof item === 'object';

  if (isObj) {
    if (!item.name) return;

    const metadata = item.metadata;

    // @todo validate urls and support webp
    if (metadata?.imageurl) return `${metadata.imageurl}`;
    if (metadata?.image) return `${imagepath}/${metadata.image}.png`;
  }

  const itemName = isObj ? (item.name as string) : item;
  const itemData = Items[itemName];

  if (!itemData) return `${imagepath}/${itemName}.png`;
  if (itemData.image) return itemData.image;

  itemData.image = `${imagepath}/${itemName}.png`;

  return itemData.image;
};