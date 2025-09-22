"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const sports = ["#Badminton", "#Cricket", "#Football", "#Volleyball", "#Chess"];

export default function TextFlipLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sports.length);
    }, 400); // much faster flip (every 0.4s)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white text-blue-500 text-4xl font-bold z-50">
      <AnimatePresence mode="wait">
        <motion.span
          key={sports[index]}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }} // faster animation
          className="inline-block"
        >
          {sports[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
