"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Mode = "default" | "view" | "magnetic" | "heart";

/** Desktop-only cursor. Disabled on touch and reduced-motion. Native cursor is hidden only while this is active. */
export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 }), sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const modeRef = useRef<Mode>("default");

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    setActive(true); document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const m = (el?.dataset.cursor as Mode) || "default";
      if (m !== modeRef.current) { modeRef.current = m; setMode(m); }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over); document.documentElement.classList.remove("has-cursor"); };
  }, [x, y]);

  if (!active) return null;
  const size = mode === "view" ? 78 : mode === "magnetic" ? 46 : mode === "heart" ? 34 : 10;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full text-[10px] tracking-[0.2em] text-white mix-blend-normal" style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }} animate={{ width: size, height: size, backgroundColor: mode === "view" ? "rgba(255,61,127,.85)" : mode === "default" ? "rgba(255,200,215,.95)" : "rgba(255,61,127,.22)" }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
      {mode === "view" && "VIEW"}
      {mode === "heart" && <span className="beat">♥</span>}
    </motion.div>
  );
}
