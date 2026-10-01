"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { site } from "@/app/data/site";
import { qualities } from "@/app/data/messages";
import { Rich, ease, lockScroll } from "@/lib/utils";
import { Fade } from "./Reveal";
import FloatingParticles from "./FloatingParticles";
import EasterEgg from "./EasterEgg";

// hand-placed offsets so the words feel scattered, not gridded
const layout = [
  "md:ml-[4%] md:text-6xl", "md:ml-[48%] md:text-5xl", "md:ml-[14%] md:text-7xl", "md:ml-[55%] md:text-6xl", "md:ml-[2%] md:text-5xl",
  "md:ml-[40%] md:text-7xl", "md:ml-[10%] md:text-6xl", "md:ml-[58%] md:text-5xl", "md:ml-[24%] md:text-6xl",
];

export default function SpecialQualities() {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    lockScroll(open !== null);
    if (open === null) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); lockScroll(false); };
  }, [open]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-wine via-plum to-night px-6 py-32 md:px-16" aria-label={site.special.title}>
      <FloatingParticles count={30} hearts={0.1} />
      <EasterEgg message={site.easterEggs.hiddenHeart} className="right-4 top-20 md:right-16" />
      <Fade className="relative text-center">
        <h2 className="font-display display-lg">{site.special.title}</h2>
        <p className="mt-4 font-hand text-xl text-champagne/80">{site.special.hint}</p>
      </Fade>

      <div className="relative mx-auto mt-24 flex max-w-5xl flex-col gap-10 md:gap-14">
        {qualities.map((q, i) => (
          <motion.button
            key={q.word} layoutId={`q-${i}`} onClick={() => setOpen(i)} data-cursor="heart"
            className={`focus-ring w-fit self-center text-left font-display text-4xl italic text-blush/90 hover:text-white ${layout[i % layout.length]}`}
            animate={{ y: [0, -8, 0] }} transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            aria-label={`${q.word}: open message`}
          >
            {q.word}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-night/92 px-6 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={qualities[open].word}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,61,127,.22), transparent 60%)" }} />
            <button onClick={() => setOpen(null)} aria-label="Close" className="focus-ring absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full text-blush hover:bg-white/10" style={{ marginTop: "var(--sat)" }}><X /></button>
            <div className="relative max-w-2xl text-center" onClick={(e) => e.stopPropagation()}>
              <motion.h3 layoutId={`q-${open}`} className="font-display text-6xl italic text-white md:text-8xl">{qualities[open].word}</motion.h3>
              <motion.div initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.35, duration: 1, ease }}>
                <p className="mx-auto mt-10 max-w-xl font-display text-2xl leading-relaxed text-ivory md:text-3xl">{qualities[open].message}</p>
                <p className="mt-6 font-hand text-xl text-champagne"><Rich text={qualities[open].note} /></p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
