import React, { useEffect, useCallback } from 'react';

interface Props {
    activePanel: 'utils' | 'inventory';
    setActivePanel: (panel: 'utils' | 'inventory') => void;
}

const InventoryPanelSwitcher: React.FC<Props> = ({ activePanel, setActivePanel }) => {
    // keyboard shortcuts (Q/E)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'q') {
            setActivePanel('inventory');
        }
        if (e.key.toLowerCase() === 'e') {
            setActivePanel('utils');
        }
    }, [setActivePanel]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div
            className="inventory-utils"
            style={{
                position: 'absolute',
                right: 0,
                top: '5vh',
                paddingRight: '12rem',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
            }}
        >
            <button
                className={`inventory-switch ${activePanel === 'inventory' ? 'active' : ''}`}
                onClick={() => setActivePanel('inventory')}
            >
                <a className="inventory-switch-btn">Q</a> INVENTORY
            </button>
            <button
                className={`inventory-switch ${activePanel === 'utils' ? 'active' : ''}`}
                onClick={() => setActivePanel('utils')}
            >
                UTILITY <a className="inventory-switch-btn">E</a>
            </button>
        </div>
    );
};

export default InventoryPanelSwitcher;
