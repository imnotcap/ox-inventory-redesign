import React, { useState } from 'react';
import InventoryGrid from './InventoryGrid';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectRightInventory } from '../../store/inventory';
import { InventoryType, DragSource } from '../../typings';
import { useDrop } from 'react-dnd';
import { onBuy } from '../../dnd/onBuy';
import { closeTooltip } from '../../store/tooltip';
import { getItemUrl } from '../../helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNui } from '../../utils/fetchNui';

interface ShopItem {
    slot: number;
    name: string;
    price?: number;
    metadata?: { label?: string };
    image?: string;
    currency?: string;
    weight?: number;
}

interface CartItem {
    itemKey: string; // unique key derived from name + slot
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface Ingredient {
    label: string;
    qty: number;
}

interface CraftingRecipe {
    name: string;
    label: string;
    ingredients: Record<string, Ingredient>;
    duration: number;
    count: number;
}

interface CraftingQueueItem {
    recipe: CraftingRecipe;
    quantity: number;
}

const craftingData: { items: CraftingRecipe[] } = {
    items: [
        {
            name: "lockpick",
            label: "Lockpick",
            ingredients: {
                iron_bar: { label: "Scrap Metal", qty: 5 },
                steel: { label: "Iron Ingot", qty: 1 },
            },
            duration: 5000,
            count: 2,
        },
        {
            name: "armor",
            label: "Armor",
            ingredients: {
                scrapmetal: { label: "Scrap Metal", qty: 5 },
                ironingot: { label: "Iron Ingot", qty: 1 },
            },
            duration: 5000,
            count: 2,
        },
        {
            name: "medkit",
            label: "Medkit",
            ingredients: {
                cloth: { label: "Cloth", qty: 3 },
            },
            duration: 3000,
            count: 1,
        },
        {
            name: "weapon_combatpistol",
            label: "Combat Pistol",
            ingredients: {
                cloth: { label: "Cloth", qty: 3 },
            },
            duration: 3000,
            count: 1,
        },
        {
            name: "bandage",
            label: "Bandage",
            ingredients: {
                cloth: { label: "Cloth", qty: 3 },
            },
            duration: 3000,
            count: 1,
        },
    ],
};

const RightInventory: React.FC = () => {
    const rightInventory = useAppSelector(selectRightInventory);
    const dispatch = useAppDispatch();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe>(craftingData.items[0]);
    const [recipeQuantity, setRecipeQuantity] = useState<number>(1);
    const [craftQueue, setCraftQueue] = useState<CraftingQueueItem[]>([]);

    if (!rightInventory) return null;

    const { type } = rightInventory;
    const hideExtras = type === 'shop';

    const addToQueue = () => {
        setCraftQueue((prev) => [...prev, { recipe: selectedRecipe, quantity: recipeQuantity }]);
        setRecipeQuantity(1);
    };

    const addToCart = (item: ShopItem) => {
        const itemKey = item.name + (item.slot ?? '');
        const itemName = item.metadata?.label || item.name;
        const itemPrice = item.price ?? 0;
        const itemImage = getItemUrl(item.name);

        setCart((prev) => {
            const existing = prev.find((i) => i.itemKey === itemKey);
            if (existing) {
                return prev.map((i) =>
                    i.itemKey === itemKey ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { itemKey, name: itemName, price: itemPrice, quantity: 1, image: itemImage }];
        });
    };

    const [{ isOver, canDrop }, drop] = useDrop<DragSource & { item: ShopItem }, void, { isOver: boolean; canDrop: boolean }>(
        () => ({
            accept: 'SLOT',
            canDrop: (source) => source.inventory === InventoryType.SHOP,
            drop: (source) => {
                if (!source.item) return;
                addToCart(source.item);
            },
        }),
        [cart]
    );

    const removeFromCart = (itemKey: string) => setCart((prev) => prev.filter((i) => i.itemKey !== itemKey));

    const changeQuantity = (itemKey: string, delta: number) =>
        setCart((prev) =>
            prev
                .map((i) => (i.itemKey === itemKey ? { ...i, quantity: i.quantity + delta } : i))
                .filter((i) => i.quantity > 0)
        );

    const totalCost = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const pay = (method: 'cash' | 'bank') => {
        if (cart.length === 0) return;

        const itemsPayload = cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        }));

        fetchNui('buyItems', { items: itemsPayload, method: method })
    }

    return (
        <div className={`right-inventory ${type === 'shop' ? 'right-inventory-shop' : ''}`}>
            <AnimatePresence>
                {/* Main inventory appears from top */}
                {rightInventory && type !== "crafting" && (
                    <div key={rightInventory.type} className="inventory-item">
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <InventoryGrid
                                inventory={rightInventory}
                                hideExtras={hideExtras}
                                noWrapper={false}
                                onCtrlClick={addToCart}
                            />
                        </motion.div>
                    </div>
                )}

                {/* Shopping cart appears from bottom */}
                {type === 'shop' && (
                    <motion.div
                        ref={drop}
                        key="shopping-cart"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`inventory-grid-wrapper shopping-cart ${isOver && canDrop ? 'highlight' : ''}`}
                    >
                        <a style={{
                            fontSize: '1.5vh',
                            fontWeight: '600',
                            paddingBottom: '0.5rem',
                            paddingTop: '0.5rem',
                        }}>Indkøbskurv</a>
                        {cart.length === 0 && <div className="no-items">
                            <i className="fal fa-layer-plus"></i>
                            <p>
                                Tilføj ting til indkøbskurven
                                <a>Alternativ: CTRL + Klik for hurtig tilføjelse</a>
                            </p>
                        </div>}
                        <div className="cart-item-grid">
                            {cart.map((item) => (
                                <div
                                    className="cart-item inventory-slot"
                                >
                                    {item.image && <img src={item.image} alt={item.name} />}
                                    <div className="cart-info">
                                        <p>{item.name}</p>
                                        <div className="cart-controls">
                                            <button style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '0.8rem',
                                            }} onClick={() => changeQuantity(item.itemKey, -1)}><i className="fal fa-minus"></i></button>
                                            <span>{item.quantity}</span>
                                            <button style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '0.8rem',
                                            }} onClick={() => changeQuantity(item.itemKey, 1)}><i className="fal fa-plus"></i></button>
                                            <button style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: '0.8rem',
                                            }} onClick={() => removeFromCart(item.itemKey)}><i className="fal fa-trash"></i></button>
                                        </div>
                                    </div>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        {cart.length > 0 && (
                            <div className="cart-footer">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <a>Total:</a>
                                    <p>${totalCost.toFixed(2)}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'end' }}>
                                    <button onClick={() => pay('cash')}>Betal Kontant</button>
                                    <button onClick={() => pay('bank')}>Betal Bank</button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {type === "crafting" && (
                    <motion.div
                        ref={drop}
                        key="crafting-recipes"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{
                            width: '50vh'
                        }}
                        className={`inventory-grid-wrapper crafting-grid ${isOver && canDrop ? "highlight" : ""
                            }`}
                    >
                        <h3>Crafting</h3>

                        <div className="crafting-container">
                            {/* Left: recipe list */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                justifyContent: 'space-between',
                                gap: '1vh',
                                maxHeight: '12vh',
                                overflow: 'hidden',
                                overflowY: 'auto',
                                paddingRight: '0.5rem',
                            }}>
                                {craftingData.items.map((recipe, i) => (
                                    <div
                                        key={i}
                                        className={`recipe-item ${selectedRecipe?.name === recipe.name ? "selected" : ""}`}
                                        style={{
                                            backgroundColor: selectedRecipe?.name === recipe.name ? 'rgba(119,222,185,0.2)' : 'transparent',
                                            border: selectedRecipe?.name === recipe.name ? '1px solid #77deb9' : '1px solid rgba(255, 255, 255, 0.1)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'relative',
                                            borderRadius: '0.5rem',
                                            width: '10.8vh',
                                            height: '11.1vh',
                                        }}
                                        onClick={() => setSelectedRecipe(recipe)}
                                    >
                                        {/* ✅ Show recipe image just like inventory slots */}
                                        <img
                                            src={getItemUrl(recipe.name.toLowerCase())}
                                            alt={recipe.name}
                                            style={{ width: "4vh", height: "4vh", objectFit: "cover", position: 'absolute' }}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            textAlign: 'center',
                                            position: 'absolute',
                                            bottom: '0.5rem',
                                            fontWeight: '600',
                                            fontSize: '1.1vh',
                                        }}>
                                            <p>{recipe.label || recipe.name}</p>
                                        </div>
                                        <p style={{
                                            position: 'absolute',
                                            top: '0.5vh',
                                            right: '0.5vh',
                                            fontSize: '1vh',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '2vh',
                                            height: '2vh',
                                            borderRadius: '100%',
                                            border: '1px solid rgba(255,255,255,0.3)',

                                        }}>{recipe.count}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Right: selected recipe details */}
                            <div className="recipe-details">
                                {selectedRecipe ? (
                                    <>
                                        <div style={{
                                            width: '100%',
                                            height: '0.1rem',
                                            marginTop: '1rem',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }}></div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}>
                                            {/* Recipe Image + Name */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1vh' }}>
                                                <a style={{
                                                    fontSize: '3vh',
                                                    marginTop: '1rem',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                }}>
                                                    {selectedRecipe.label || selectedRecipe.name}
                                                </a>
                                            </div>

                                            <div>
                                                <p style={{
                                                    fontWeight: '400',
                                                    fontSize: '1vh',
                                                    color: 'rgba(255,255,255,0.5)',
                                                }}>Mængde</p>
                                                <a style={{
                                                    marginTop: '0.5vh',
                                                    display: 'flex',
                                                    fontWeight: '600',
                                                }}>{selectedRecipe.count}</a>
                                            </div>
                                        </div>

                                        <p style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            color: 'rgba(255,255,255,0.5)',
                                            fontWeight: '500',
                                        }}>
                                            CRAFTING TID:
                                            <a style={{
                                                color: 'rgba(255,255,255)',
                                                fontSize: '1.25vh',
                                                backgroundColor: 'rgba(119,222,185,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '0.5rem 0.85rem',
                                                borderRadius: '0.35rem',
                                                border: '1px solid rgba(119,222,185)',
                                            }}>
                                                {selectedRecipe.duration / 1000}s
                                            </a>
                                        </p>

                                        <a style={{
                                            marginTop: '1.5rem',
                                            display: 'flex',
                                            fontSize: '1vh',
                                            color: 'rgba(255,255,255,0.5)',
                                        }}>Ting Krævet</a>

                                        {/* Ingredients Grid */}
                                        <div className="ingredients-grid" style={{
                                            display: 'flex',
                                            gap: '1vh',
                                            marginTop: '0.5rem',
                                        }}>
                                            {Object.entries(selectedRecipe.ingredients).map(([itemName, info]) => (
                                                <div key={itemName} className="ingredient-slot inventory-slot" style={{
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    border: '1px solid rgba(255,255,255,0.15)',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    position: 'relative',
                                                    borderRadius: '0.5rem',
                                                    width: '5vh',
                                                    height: '4.5vh',
                                                }}>
                                                    <img
                                                        src={getItemUrl(itemName.toLowerCase())} // ✅ ingredient image
                                                        alt={info.label}
                                                        style={{ width: "4vh", objectFit: "contain", position: 'absolute' }}
                                                    />
                                                    <div className="ingredient-info">
                                                        <span style={{
                                                            color: 'rgba(255,255,255)',
                                                            position: 'absolute',
                                                            fontSize: '1vh',
                                                            bottom: '0.5vh',
                                                            right: '0.8vh',
                                                        }}>
                                                            0/{info.qty} {/* You can dynamically update 0 -> inventory count */}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Queue + Quantity Selector */}
                                        <div className="Queue" style={{
                                            color: 'rgba(255,255,255)',
                                            display: 'flex',
                                            marginTop: '1.5rem',
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                            }}>
                                                <a style={{
                                                    color: 'rgba(255,255,255,0.5)',
                                                    fontSize: '1vh',
                                                }}>Mængde</a>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.5)', padding: '0.5rem', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '0.5rem' }}>
                                                    <button style={{ color: 'white', background: 'transparent', border: 'none' }} onClick={() => setRecipeQuantity(Math.max(1, recipeQuantity - 1))}><i className="fas fa-minus"></i></button>
                                                    <span style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        width: '4rem',
                                                    }}>{recipeQuantity}</span>
                                                    <button style={{ color: 'white', background: 'transparent', border: 'none' }} onClick={() => setRecipeQuantity(recipeQuantity + 1)}><i className="fas fa-plus"></i></button>
                                                </div>
                                            </div>

                                            <button onClick={addToQueue} style={{
                                                color: 'rgba(255,255,255)',
                                                width: '60%',
                                                backgroundColor: 'rgba(119,222,185,0.2)',
                                                border: '1px solid #77deb9',
                                                borderRadius: '0.5rem',
                                                padding: '1.5rem',
                                                fontSize: '1.25vh',
                                                fontWeight: '600',
                                            }}>
                                                Tilføj Til Kø
                                            </button>
                                        </div>

                                        {/* Craft Queue */}
                                        <div style={{
                                            width: '100%',
                                            height: '0.1rem',
                                            marginTop: '1rem',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }}></div>
                                        <a style={{
                                            marginTop: '1rem',
                                            display: 'flex',
                                            fontSize: '1.2vh',
                                            color: 'rgba(255,255,255,0.5)',
                                            fontWeight: '500',
                                        }}>Crafting Kø</a>
                                        {craftQueue.length > 0 && (
                                            <div style={{
                                                display: 'flex',
                                                gap: '1vh',
                                                flexWrap: 'wrap',
                                                marginTop: '1rem',
                                                maxHeight: '13vh',
                                                overflow: 'hidden',
                                                overflowY: 'auto',
                                            }}>
                                                {craftQueue.map((q, idx) => (
                                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1vh', marginTop: '0.5rem' }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            position: 'relative',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexDirection: 'column',
                                                            gap: '1vh',
                                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                                            border: '1px solid rgba(255,255,255,0.15)',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '0.5rem',
                                        
                                                            width: '9vh',
                                                            height: '9vh',
                                                        }}>
                                                        <img src={getItemUrl(q.recipe.name.toLowerCase())} alt={q.recipe.label} style={{ 
                                                            width: '5vh', 
                                                            objectFit: 'contain',
                                                            }} />
                                                        <span style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            width: '9.5vh',
                                                            top: '0.5rem',
                                                            fontWeight: '600',
                                                            fontSize: '1.15vh',
                                                            alignItems: 'center',
                                                            position: 'absolute',
                                                        }}>{q.recipe.label} <a>x{q.quantity}</a></span>

                                                        {/* Progress & Cancel */}
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            position: 'absolute',
                                                            bottom: '0.75rem',
                                                            width: '9.5vh',
                                                            justifyContent: 'space-between',
                                                        }}>
                                                            <div style={{
                                                                width: '1vh',
                                                            
                                                                height: '1vh',
                                                                border: '2px solid rgba(255,255,255,0.25)',
                                                                borderRadius: '100%',
                                                                overflow: 'hidden',
                                                            }}></div>
                                                            <div style={{
                                                                color: 'rgba(255,255,255,0.25)',
                                                            }}>
                                                            <i className="fal fa-circle-x"></i>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p>Select a recipe</p>
                                )}
                            </div>

                        </div>
                    </motion.div>
                )}



            </AnimatePresence>
        </div>
    );
};

export default RightInventory;
