import { motion } from "framer-motion";
import React from "react";

import TreasureChestOpened from "./open-chest";

interface IconWindowProps {
  state: "waiting" | "digging" | "opened";
}

const IconWindow: React.FC<IconWindowProps> = ({ state }) => {
  const getImageSrc = () => {
    switch (state) {
      case "waiting":
        return "../images/closed-chest.png"; // 閉じた宝箱の画像
      case "digging":
        return "../images/closed-chest.png"; // 揺れる宝箱の画像
      case "opened":
        return "../images/opened-chest.png"; // 開いた宝箱の画像
      default:
        return "../images/closed-chest.png";
    }
  };

  const opened_chest = "../images/opened-chest.png";
  const closed_chest = "../images/closed-chest.png";

  return (
    <div className="flex h-full w-full items-center justify-center">
      {state === "waiting" && (
        <img
          src={closed_chest}
          alt="closed-chest"
          style={{ width: "150px", height: "auto" }}
        />
      )}
      {state === "digging" && (
        <motion.img
          src={closed_chest}
          alt="digging-chest"
          animate={{
            x: [-5, 5, -5, 5, 0], // 左右に揺れるアニメーション
          }}
          transition={{
            repeat: Infinity, // 無限に繰り返す
            repeatType: "loop",
            duration: 0.6, // 揺れの速さ
            ease: "easeInOut",
            repeatDelay: 0.5, // 揺れた後に0.5秒の停止
          }}
          style={{ width: "150px", height: "auto" }}
        />
      )}
      {state === "opened" && (
        <motion.img
          src={opened_chest}
          alt="Opened Treasure Chest"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: "150px", height: "auto" }}
        />
      )}
    </div>
  );
};

export default IconWindow;
