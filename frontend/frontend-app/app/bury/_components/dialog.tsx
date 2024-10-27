"use client";
import { motion } from "framer-motion";
import TreasureBox from "./bury_animation";
import { useState } from "react";

interface DialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ onConfirm, onCancel }) => {
  const [isDropped, setIsDropped] = useState(false);
  const handleDrop = () => {
    setIsDropped(!isDropped);
    onConfirm();
  };
  return (
    <div className="fixed inset-0 m-10 flex flex-col justify-between rounded-lg border border-2 border-gray-300 bg-white p-10 shadow-lg">
      <p className="text-center text-2xl">本当に埋めますか？</p>
      <div
        className="grid w-full"
        style={{
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{
            y: isDropped ? 300 : 0,
            scale: isDropped ? 0.75 : 1,
            rotate: isDropped ? 30 : 0,
            opacity: isDropped ? 0 : 1,
          }}
          transition={{
            duration: 3,
            type: "spling",
            stiffness: 100,
          }}
        >
          <TreasureBox />
        </motion.div>
      </div>
      <div className="grid h-20 w-full grid-cols-2 gap-4">
        <button
          className="rounded-lg border text-center text-lg shadow-lg"
          onClick={onCancel}
        >
          キャンセル
        </button>
        <button
          className="rounded-lg border bg-blue-500 text-center text-lg text-white shadow-lg"
          onClick={handleDrop}
        >
          埋める
        </button>
      </div>
    </div>
  );
};

export default Dialog;
