import React from 'react';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import InventorySlot from './InventorySlot'; // your slot renderer
import { Inventory } from '../../typings';
import Image from '../images/man.svg';

// map of logical slot names → slot index
const SLOT_MAP: Record<string, number> = {
    backpack: 1,
    bodyArmour: 2,
    phone: 3,
    parachute: 4,
    weapon1: 5,
    weapon2: 6,
    hotkey1: 7,
    hotkey2: 8,
    hotkey3: 9,
    hotkey4: 10,
};

const InventoryUtils = () => {
    const { items, id, type, groups } = useAppSelector(selectLeftInventory);

    const getSlot = (slotName: keyof typeof SLOT_MAP) =>
        items.find((i) => i.slot === SLOT_MAP[slotName]) || { slot: SLOT_MAP[slotName] };

    return (
        <div
            className="utils-inventory"
            style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                width: '42.5vh',
                height: '50vh',
            }}
        >
            <div className="utils-left-grid" style={{ position: 'absolute', left: 0, zIndex: '999', }}>
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('backpack')} />
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('bodyArmour')} />
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('phone')} />
            </div>

            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}>

                <div className="man-svg" style={{
                    width: '25vh',
                    height: '40vh',
                    zIndex: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <img style=
                        {{  
                            height: '90%',
                            filter: 'drop-shadow(0px 0px 20px rgb(162, 202, 49))',
                        }} src="https://files.fivemerr.com/images/af3633fe-ce18-4bb9-b7f5-a31c45163945.svg" />
                </div>
            </div>

            <div className="utils-right-grid" style={{ position: 'absolute', right: '0%', zIndex: '999', }}>
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('parachute')} />
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('weapon1')} />
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('weapon2')} />
            </div>

            <div className="utils-middle-grid" style={{ position: 'absolute', bottom: '0%', zIndex: '999', }}>
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('hotkey1')} />
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('hotkey2')} />
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('hotkey3')} />
                <InventorySlot inventoryId={id} inventoryType={'utility'} inventoryGroups={groups} item={getSlot('hotkey4')} />
            </div>
        </div>
    );
};

export default InventoryUtils;
