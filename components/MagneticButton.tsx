"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import HeartIcon from "./HeartIcon";

export default function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 });
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28); y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.button
      ref={ref} type="button" onClick={onClick} onPointerMove={move} onPointerLeave={leave}
      data-cursor="magnetic" style={{ x: sx, y: sy }} className="lux-btn group"
      whileHover={{ scale: 1.05, letterSpacing: "0.28em" }} whileTap={{ scale: 0.93, boxShadow: "inset 0 0 40px rgba(255,120,170,.6)" }}
    >
      <span>{children}</span>
      <HeartIcon size={18} className="transition-transform duration-500 group-hover:scale-125 beat" />
    </motion.button>
  );
}
