import { Inventory, SlotWithItem } from '../../typings';
import React, { Fragment, useMemo } from 'react';
import { Items } from '../../store/items';
import { Locale } from '../../store/locale';
import ReactMarkdown from 'react-markdown';
import { useAppSelector } from '../../store';
import ClockIcon from '../utils/icons/ClockIcon';
import { getItemUrl, itemDurability } from '../../helpers';
import Divider from '../utils/Divider';
import { Rarity } from '../../store/rarity';

type EvidenceKey = 'blood' | 'casing'

const EVIDENCE_LABELS: Record<EvidenceKey, string> = {
  blood: 'Blod',
  casing: 'Patronhylster',
}

const SlotTooltip: React.ForwardRefRenderFunction<
  HTMLDivElement,
  { item: SlotWithItem; inventoryType: Inventory['type']; style: React.CSSProperties }
> = ({ item, inventoryType, style }, ref) => {
  const additionalMetadata = useAppSelector((state) => state.inventory.additionalMetadata);
  const itemData = useMemo(() => Items[item.name], [item]);
  const ingredients = useMemo(() => {
    if (!item.ingredients) return null;
    return Object.entries(item.ingredients).sort((a, b) => a[1] - b[1]);
  }, [item]);
  const description = item.metadata?.description || itemData?.description;
  const ammoName = itemData?.ammoName && Items[itemData?.ammoName]?.label;

  // 🔥 NEW: rarity integration
  const rarityKey = (item?.rarity ?? '').toLowerCase();
  const rarityColor = Rarity[rarityKey];

  const withAlpha = (color: string, alpha: number) => {
    return color.replace(/rgba?\(([^)]+)\)/, (match, contents) => {
      if (!contents) return match;
      const parts = contents.split(',').map((p: string) => p.trim());
      if (parts.length === 3) {
        return `rgba(${parts.join(', ')}, ${alpha})`;
      } else if (parts.length === 4) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
      }
      return match;
    });
  };

  return (
    <>
      {!itemData ? (
        <div className="tooltip-wrapper" ref={ref} style={style}>
          <div className="tooltip-header-wrapper" style={{
            justifyContent: 'center',
            width: 'fit-content',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1rem',
          }}>
            <img src={item ? getItemUrl(item) : 'none'} style={{
              width: '5vh',
              height: '5vh',
              backgroundColor: 'rgba(0,0,0, 0.5)',
              borderRadius: '5px',
            }} />
            <p>{item.name}</p>
          </div>
        </div>
      ) : (
        <div ref={ref}
          className="tooltip-wrapper"
          style={{
            ...style,
            borderRadius: '6px',
            background: rarityColor
              ? `
              linear-gradient(45deg, #161616bb, #000000b4) padding-box,
              linear-gradient(-45deg, rgba(0,0,0,0.5), ${withAlpha(rarityColor, 1)}) border-box
            `
              : `
              linear-gradient(45deg, #161616bb, #000000b4) padding-box,
              linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.6)) border-box
            `,
            border: '1px solid transparent',
            boxShadow: rarityColor
              ? `inset 0px 0px 3vh -2vh ${withAlpha(rarityColor, 1)}`
              : 'inset 0px 0px 2vh -1vh rgba(0,0,0, 0.7)',
          }}>
          <div className="tooltip-header-wrapper" style={{
            width: '100%',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              backgroundColor: 'rgba(0,0,0, 0.25)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
              borderRadius: '5px',
              overflow: 'hidden',
            }}>
              <img src={item ? getItemUrl(item) : 'none'} style={{
                width: '4rem',
                height: '4rem',
              }} />
            </div>
            <div style={{
              gap: '2vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <p style={{
                fontSize: '1.5vh',
                fontWeight: '600',
              }}>
                <span style={{ color: rarityColor, fontWeight: '700' }}>
                  {item.metadata?.label || itemData.label || item.name}
                </span>
              </p>
              <a style={{
                fontSize: '1vh',
                fontWeight: '400',
              }}>
                <span style={{ color: rarityColor, fontWeight: '600', textTransform: 'capitalize' }}>{item.rarity || 'common'}</span>
              </a>
            </div>
          </div>
          <div className="tool-wrapper-inner-casper" style={{
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            borderRadius: '5px',
          }}>
            {description && (
              <a style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '0.5rem',
                fontSize: '1.2vh',
                color: 'rgba(255,255,255,0.7)',
              }} className="tooltip-markdown">{description}</a>
            )}
            {inventoryType !== 'crafting' ? (
              <>
                {item.metadata?.firstname !== undefined && (
                  <div className="tooltip-durability">
                    <p>Fornavn:</p>
                    <a>{item.metadata?.firstname}</a>
                  </div>
                )}

                {item.metadata?.lastname !== undefined && (
                  <div className="tooltip-durability">
                    <p>Efternavn:</p>
                    <a>{item.metadata?.lastname}</a>
                  </div>
                )}

                {item.metadata?.citizenid !== undefined && (
                  <div className="tooltip-durability">
                    <p>Border ID:</p>
                    <a>{item.metadata?.citizenid}</a>
                  </div>
                )}

                {item.metadata?.birthday !== undefined && (
                  <div className="tooltip-durability">
                    <p>Fødselsdag:</p>
                    <a>{item.metadata?.birthday}</a>
                  </div>
                )}

                {item.durability !== undefined && (
                  <div className="tooltip-durability">
                    <p>Holdbarhed:</p>
                    <a>{item.durability}%</a>
                  </div>
                )}
                {item.metadata?.ammo !== undefined && (
                  <div className="tooltip-ammo">
                    <p>Ammunition & Type</p>
                    <a>{item.metadata.ammo} <b style={{ fontWeight: '200', color: 'rgba(255,255,255,0.5)' }}> ‎‎ ‎|‎ ‎‎ </b>{ammoName}</a>
                  </div>
                )}
                {item.metadata?.serial && (
                  <div className="tooltip-ammo">
                    <p>Serienummer:</p>
                    <a>{item.metadata.serial}</a>
                  </div>
                )}
                {item.metadata?.evidencetype && (
                  <div className="tooltip-ammo">
                    <p>Bevis type:</p>
                    <a>{EVIDENCE_LABELS[item.metadata?.evidencetype as EvidenceKey]}</a>
                  </div>
                )}
                {item.metadata?.evidenceId && (
                  <div className="tooltip-ammo">
                    <p>Bevisnummer:</p>
                    <a>{item.metadata.evidenceId}</a>
                  </div>
                )}
                {item.metadata?.components && item.metadata?.components[0] && (
                  <div className="tooltip-ammo">
                    <p>Komponenter:</p>
                    <a>{(item.metadata?.components).map((component: string, index: number, array: []) =>
                      index + 1 === array.length ? Items[component]?.label : Items[component]?.label + ', '
                    )}</a>
                  </div>
                )}
                {item.metadata?.weapontint && (
                    <div className="tooltip-ammo">
                      <p>Skin:</p>
                      <a>{item.metadata.weapontint}</a>
                    </div>
                )}
                {additionalMetadata.map((data: { metadata: string; value: string }, index: number) => (
                  <Fragment key={`metadata-${index}`}>
                    {item.metadata && item.metadata[data.metadata] && (
                      <p>
                        {data.value}: {item.metadata[data.metadata]}
                      </p>
                    )}
                  </Fragment>
                ))}
              </>
            ) : (
              <div className="tooltip-ingredients">
                {ingredients &&
                  ingredients.map((ingredient) => {
                    const [item, count] = [ingredient[0], ingredient[1]];
                    return (
                      <div className="tooltip-ingredient" key={`ingredient-${item}`}>
                        <img src={item ? getItemUrl(item) : 'none'} alt="item-image" />
                        <p>
                          {count >= 1
                            ? `${count}x ${Items[item]?.label || item}`
                            : count === 0
                              ? `${Items[item]?.label || item}`
                              : count < 1 && `${count * 100}% ${Items[item]?.label || item}`}
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Casper inner edit slut */}
        </div>
      )}
    </>
  );
};

export default React.forwardRef(SlotTooltip);
