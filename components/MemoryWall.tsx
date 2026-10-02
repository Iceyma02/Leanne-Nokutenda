"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { memories } from "@/app/data/memories";
import { site } from "@/app/data/site";
import { Rich, lockScroll } from "@/lib/utils";
import SafeImage from "./SafeImage";
import HeartIcon from "./HeartIcon";
import EasterEgg from "./EasterEgg";
import { Fade } from "./Reveal";

// x/y in %, rotation in degrees. Hand-placed so it feels like a real wall.
const spots = [
  { x: 4, y: 2, r: -7, pin: true }, { x: 34, y: 10, r: 5 }, { x: 63, y: 0, r: -3, pin: true },
  { x: 14, y: 40, r: 6 }, { x: 46, y: 46, r: -6, pin: true }, { x: 72, y: 38, r: 4 },
];

function Sparkles() {
  return (
    <>
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.span key={i} className="pointer-events-none absolute left-1/2 top-1/2 text-heart" initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }} animate={{ x: Math.cos(i * 0.9) * 150, y: Math.sin(i * 0.9) * 150, opacity: 0, scale: 1 }} transition={{ duration: 1.1, delay: 0.25 }}>
          <HeartIcon size={14} />
        </motion.span>
      ))}
    </>
  );
}

export default function MemoryWall() {
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => { lockScroll(active !== null); return () => lockScroll(false); }, [active]);
  useEffect(() => {
    if (active === null) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [active]);

  const card = (i: number) => {
    const m = memories[i];
    return (
      <>
        <div className="relative aspect-square w-full overflow-hidden bg-night"><SafeImage src={m.image} alt={m.title || "A memory of us"} sizes="(max-width: 768px) 70vw, 24vw" /></div>
        {m.title && <p className="mt-2 truncate text-center font-hand text-xl text-night"><Rich text={m.title} /></p>}
      </>
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-plum via-wine to-burgundy/60 px-5 py-24 md:px-12" aria-label={site.wall.title}>
      <Fade className="text-center">
        <h2 className="font-display display-lg">{site.wall.title}</h2>
        <p className="mt-3 font-hand text-xl text-champagne/80">{site.wall.hint}</p>
      </Fade>

      {/* desktop: scattered wall. mobile: gentle stagger. */}
      <div className="relative mx-auto mt-14 max-w-6xl md:h-[780px]">
        {memories.slice(0, 6).map((_, i) => {
          const s = spots[i];
          return (
            <motion.button
              key={i} layoutId={`wall-${i}`} onClick={() => setActive(i)} data-cursor="view" aria-label={`Open memory ${i + 1}`}
              className={`focus-ring relative mb-8 block w-[72%] bg-ivory p-3 pb-4 text-left shadow-[0_18px_40px_-14px_rgba(0,0,0,.7)] md:absolute md:left-[var(--l)] md:top-[var(--t)] md:mb-0 md:w-[24%] ${i % 2 ? "ml-[24%] md:ml-0" : ""}`}
              style={{ rotate: s.r, "--l": `${s.x}%`, "--t": `${s.y}%` } as unknown as React.CSSProperties}
              initial={{ opacity: 0, y: 60, rotate: s.r * 2 }} whileInView={{ opacity: 1, y: 0, rotate: s.r }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, delay: (i % 3) * 0.12 }}
              whileHover={{ scale: 1.04, rotate: s.r / 2 }}
            >
              {s.pin && <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-heart shadow-[0_3px_6px_rgba(0,0,0,.5)]" aria-hidden />}
              {card(i)}
            </motion.button>
          );
        })}
        <EasterEgg message={site.easterEggs.wallSecret} className="bottom-2 right-6 md:bottom-10 md:right-[8%]" />
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-night/85 p-6 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)} role="dialog" aria-modal="true" aria-label="Memory">
            <motion.div layoutId={`wall-${active}`} className="relative w-full max-w-md bg-ivory p-4 pb-6 shadow-2xl" style={{ rotate: 0 }} onClick={(e) => e.stopPropagation()}>
              <Sparkles />
              <div className="relative aspect-square w-full overflow-hidden"><SafeImage src={memories[active].image} alt={memories[active].title || "A memory of us"} sizes="90vw" priority /></div>
              {memories[active].title && <p className="mt-4 text-center font-hand text-2xl text-night"><Rich text={memories[active].title} /></p>}
              {memories[active].description && <p className="mt-1 text-center text-sm text-burgundy"><Rich text={memories[active].description} /></p>}
              <button onClick={() => setActive(null)} className="focus-ring mx-auto mt-4 block min-h-11 px-4 text-xs tracking-soft text-burgundy">CLOSE</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
