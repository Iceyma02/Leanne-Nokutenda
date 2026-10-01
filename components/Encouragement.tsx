"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { site } from "@/app/data/site";
import { encouragement } from "@/app/data/messages";
import { ease } from "@/lib/utils";
import FloatingParticles from "./FloatingParticles";

/** Pinned: scroll advances one message at a time. */
export default function Encouragement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = encouragement.length;
    const idx = v < 0.08 ? -1 : Math.min(n - 1, Math.floor(((v - 0.08) / 0.9) * n));
    setI((p) => (p === idx ? p : idx));
  });
  return (
    <section ref={ref} className="relative bg-night" style={{ height: `${(encouragement.length + 1) * 70}vh` }} aria-label={site.encouragement.title}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-8 text-center">
        <FloatingParticles count={25} hearts={0.05} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(90,22,48,.45), transparent 65%)" }} />
        <div className="relative max-w-4xl" aria-live="polite">
          <AnimatePresence mode="wait">
            {i < 0 ? (
              <motion.h2 key="t" className="font-display display-lg italic text-champagne" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 1.1, ease }}>{site.encouragement.title}</motion.h2>
            ) : (
              <motion.p key={i} className="font-display display-lg text-ivory" initial={{ opacity: 0, y: 30, filter: "blur(12px)", letterSpacing: "0.06em" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "-0.01em" }} exit={{ opacity: 0, y: -20, filter: "blur(10px)" }} transition={{ duration: 1.2, ease }}>{encouragement[i]}</motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
