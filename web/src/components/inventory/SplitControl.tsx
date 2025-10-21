import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SplitControlProps {
  item: object;
  amount: number;
  infoVisible: boolean;
  setInfoVisible: (visible: boolean) => void;
}

const SplitControl: React.FC<SplitControlProps> = ({ item, amount, infoVisible, setInfoVisible }) => {
  const [splitAmount, setSplitAmount] = useState(amount);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}>
        <div 
        className="inventory-grid-wrapper"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          position: "relative",
          width: "20vh",
        }}
        >
          <h2 style={{ marginBottom: "15px", textAlign: 'center', fontSize: "1.5vh" }}>Split Item</h2>
            <input
              value={splitAmount}
              onChange={(e) => setSplitAmount(Number(e.target.value))}
              style={{
                width: "75%",
                textAlign: "center",
                fontSize: "1.25vh",
                fontWeight: "600",
                fontFamily: 'Geist, sans-serif',
              }}
            />

          {/* Framer Motion slider */}
          <motion.div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(0,0,0,0.5)",
              borderRadius: "4px",
              position: "relative",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                width: `${(splitAmount / amount) * 100}%`,
                background: "#77deb9",
                borderRadius: "4px",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(splitAmount / amount) * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </motion.div>

          {/* Fraction buttons */}
          {/* <div style={{ gap: '10px', display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            {[1 / 2, 1 / 3, 1 / 4].map((fraction) => (
              <button
              className="split-button"
                key={fraction}
                style={{
                  flex: 1,
                  margin: "0 5px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                onClick={() => setSplitAmount(Math.floor(amount * fraction))}
              >
                1/{1 / fraction}
              </button>
            ))}
          </div> */}

          {/* Action buttons */}
          <div style={{ width: '100%', gap: '10px', display: "flex", justifyContent: "space-between" }}>
            <button className="split-button"
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: 'Geist, sans-serif',
              }}
              onClick={() => {
                infoVisible;
              }}
            >
              Annullér
            </button>
            <button className="split-button"
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: 'Geist, sans-serif',
              }}
            >
              Split
            </button>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};

export default SplitControl;
