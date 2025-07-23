"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type CircleCfg = {
  label: string;
  speed: number;
  end: number;
  colors: [string, string];
};

const CIRCLES: CircleCfg[] = [
  { label: "Imagination", speed: 30, end: 60, colors: ["#6b4fd1", "#7534eeff"] },
  { label: "Transparency", speed: 50, end: 70, colors: ["#6c5fe0ff", "#6d1febff"] },
  { label: "Reliable", speed: 70, end: 80, colors: ["#4220d8ff", "#441fe6ff"] },
];

function Circle({ cfg, inView }: { cfg: CircleCfg; inView: boolean }) {
  const { label, speed, end, colors } = cfg;
  const [p, setP] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const size = 120;
  const stroke = 8;
  const r = size / 2 - stroke / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (p / 100) * circumference;

  useEffect(() => {
    if (inView) {
      // clear any existing interval
      if (intervalRef.current) clearInterval(intervalRef.current);

      setP(0);
      intervalRef.current = window.setInterval(() => {
        setP(x => (x >= end ? end : x + 1));
      }, speed);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [inView, speed, end]);

  return (
    <motion.div
      className="flex-shrink-0 w-1/3 max-w-xs p-2"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 0.9, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg p-[1rem]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
          <defs>
            <linearGradient id={`g-${label}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={`url(#g-${label})`}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.3s ease" }}
          />
          <text
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle"
            className="fill-white font-semibold"
            style={{ fontSize: size * 0.2 }}
          >
            {p}%
          </text>
        </svg>
        <p className="mt-2 text-center text-white text-[18px]">{label}</p>
      </div>
    </motion.div>
  );
}

export default function ProgressPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);

    return () => {
      if (ref.current) obs.unobserve(ref.current);
      obs.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 bg-center bg-cover relative z-10"
      style={{
        backgroundImage: "url('/bg-2.jpg')",
        backgroundColor: "rgba(127, 20, 226, 0.4)",
      }}
    >
      <div className="flex justify-center gap-6 max-w-4xl w-full p-[1rem]">
        {CIRCLES.map(cfg => (
          <Circle key={cfg.label} cfg={cfg} inView={inView} />
        ))}
      </div>
    </div>
  );
}
