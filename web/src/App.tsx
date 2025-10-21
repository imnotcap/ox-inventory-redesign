import InventoryComponent from './components/inventory';
import useNuiEvent from './hooks/useNuiEvent';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { setImagePath } from './store/imagepath';
import { setupInventory } from './store/inventory';
import { Inventory } from './typings';
import { useAppDispatch } from './store';
import { debugData } from './utils/debugData';
import DragPreview from './components/utils/DragPreview';
import { fetchNui } from './utils/fetchNui';
import { useDragDropManager } from 'react-dnd';
import KeyPress from './components/utils/KeyPress';

// --- Debug Data for local dev / npm run start ---
debugData([
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'test',
        type: 'player',
        slots: 10,
        label: 'Bob Smith',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: 'phone',
            weight: 3000,
            rarity: 'common',
            metadata: {
              description: `name: Svetozar Miletic  \n Gender: Male`,
              ammo: 3,
              mustard: '60%',
              ketchup: '30%',
              mayo: '10%',
            },
            count: 5,
          },
          {
            slot: 3,
            name: 'Water',
            weight: 100,
            rarity: 'uncommon',
            count: 1,
            metadata: { 
              description: 'Generic item description',
              serial: 'SN123456789',
              ammo: 30,
              type: '9mm',
              label: 'Custom Water Label',
            },
          },
          {
            slot: 4,
            name: 'water',
            weight: 100,
            rarity: 'mythic',
            count: 1,
            metadata: { 
              description: 'Generic item description',
              serial: 'SN123456789',
              ammo: 30,
              type: '9mm',
              label: 'Custom Water Label',
            },
          },
          { slot: 5, name: 'water', rarity: 'common', weight: 100, count: 1 },
          {
            slot: 6,
            name: 'backwoods',
            weight: 100,
            count: 1,
            rarity: 'rare',
            metadata: {
              label: 'Russian Cream',
              imageurl: 'https://i.imgur.com/2xHhTTz.png',
            },
          },
        ],
      },
      backpackInventory: {
        id: 'backpack',
        type: 'backpack',
        slots: 8,
        label: 'Backpack',
        weight: 1000,
        maxWeight: 2000,
        items: [],
      },
      rightInventory: {
        id: 'crafting',
        type: 'crafting',
        slots: 5000,
        label: 'Test',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 2,
            name: 'burger',
            weight: 100,
            rarity: 'common',
            price: 1,
            count: 1,
          },
          {
            slot: 3,
            name: 'phone',
            weight: 100,
            rarity: 'common',
            price: 1,
            count: 1,
          },
          {
            slot: 1,
            name: 'phone',
            weight: 100,
            rarity: 'common',
            price: 1,
            count: 1,
          },
          {
            slot: 4,
            name: 'phone',
            weight: 100,
            rarity: 'common',
            price: 1,
            count: 1,
          },
        ],
      },
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();

  // Nui init event (real server data)
  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
    imagepath: string;
  }>('init', ({ locale, items, leftInventory, imagepath }) => {
    for (const name in locale) Locale[name] = locale[name];
    for (const name in items) Items[name] = items[name];

    setImagePath(imagepath);
    dispatch(setupInventory({ leftInventory }));
  });

  // Setup inventories (for debugData / dev mode)
  useNuiEvent<{
    leftInventory: Inventory;
    backpackInventory: Inventory;
    rightInventory: Inventory;
  }>('setupInventory', ({ leftInventory, backpackInventory, rightInventory }) => {
    dispatch(setupInventory({ leftInventory, backpackInventory, rightInventory }));
  });

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  return (
    <div className="app-wrapper">
      <InventoryComponent />
      <DragPreview />
      <KeyPress />
    </div>
  );
};

addEventListener('dragstart', function (event) {
  event.preventDefault();
});

export default App;
