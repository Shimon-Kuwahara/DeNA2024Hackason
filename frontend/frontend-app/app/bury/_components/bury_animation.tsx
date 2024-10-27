"use client";
import { motion } from "framer-motion";

import Image from "next/image";

export default function TreasureBox() {
  const isOpen = false;

  // 宝箱の蓋のアニメーション設定
  const boxVariants = {
    closed: {
      rotateX: 0,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
    open: {
      rotateX: -30,
      transition: { duration: 1.5 },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <motion.div
        animate={{
          y: isOpen ? 0 : 100,
          scale: isOpen ? 1.2 : 1,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 1.5,
          type: "spling",
        }}
        style={{
          height: "100px",
          maxWidth: "60%",
        }}
      >
        <Image
          width={200}
          height={200}
          src="/images/photo_pinboke.png"
          alt="photo_pinboke"
        />
      </motion.div>

      <motion.div
        style={{ height: "250px" }}
        animate={isOpen ? "open" : "closed"}
        variants={boxVariants}
      >
        <Image
          width={200}
          height={200}
          src="/images/closed-chest.png"
          alt="closed-chest"
        />
      </motion.div>
    </div>
  );
}
