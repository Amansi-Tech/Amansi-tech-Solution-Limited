"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Props { label: string; percent: number; }

export default function CircularProgress({ label, percent }: Props) {
  const radius = 40, stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    setOffset(circumference);
  }, [circumference]);

  return (
    <div className="relative flex flex-col items-center w-32 h-40">
      <motion.svg
        className="w-32 h-32 -rotate-90"
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: circumference - (percent / 100) * circumference }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        width={radius * 2}
        height={radius * 2}
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="#7c3aed"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </motion.svg>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="absolute top-12 text-2xl font-bold text-gray-800"
      >
        {percent}%
      </motion.div>
      <div className="mt-2 text-center font-medium text-indigo-700">{label}</div>
    </div>
  );
}
