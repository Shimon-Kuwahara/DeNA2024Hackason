import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const TreasureChestOpened: React.FC = () => {
  const [showRays, setShowRays] = useState(false);
  const [showOpenedChest, setShowOpenedChest] = useState(false);

  useEffect(() => {
    // 宝箱が開く際のアニメーションのタイミング設定
    setShowRays(true); // 光線を表示

    const raysTimeout = setTimeout(() => {
      setShowRays(false); // 光線を消す
      setShowOpenedChest(true); // 開いた宝箱を表示
    }, 1000); // 光線を表示した後の遅延（1秒）

    return () => clearTimeout(raysTimeout);
  }, []);

  // ランダムな光線を生成する関数
  const generateRays = () => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = Math.random() * 360; // 0から360度のランダムな角度
      const delay = Math.random() * 0.3; // 0〜0.3秒のランダムな遅延

      return (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-16 w-1 origin-bottom bg-white"
          style={{ rotate: `${angle}deg` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: 0.4,
            delay,
            repeat: 1,
            repeatType: "reverse",
            ease: "easeOut",
          }}
        />
      );
    });
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* 光線のアニメーション */}
      {showRays && <div className="absolute inset-0">{generateRays()}</div>}

      {/* 開いた宝箱の画像 */}
      {showOpenedChest && (
        <motion.img
          src="../images/opened-chest.png"
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

export default TreasureChestOpened;
