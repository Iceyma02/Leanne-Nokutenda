"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { site } from "@/app/data/site";
import { ease } from "@/lib/utils";
import FloatingParticles from "./FloatingParticles";

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const t = site.hero;
  const d = (s: number) => (ready ? s : 99);

  return (
    <section ref={ref} className="relative grain flex min-h-[100svh] items-center justify-center overflow-hidden bg-night" aria-label="Happy Birthday">
      <motion.div style={{ y: yBack }} className="absolute inset-[-10%]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 120%, #5a1630 0%, #2a0c1d 40%, #0a0408 75%)" }} />
        <div className="absolute left-1/2 top-[18%] h-[46vmax] w-[46vmax] -translate-x-1/2 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,61,127,.55), transparent 65%)" }} />
        <div className="absolute right-[8%] top-[10%] h-3 w-3 rounded-full bg-champagne shadow-[0_0_60px_30px_rgba(217,192,147,.25)]" />
      </motion.div>
      <FloatingParticles count={70} hearts={0.14} />
      <motion.div style={{ y: yText, opacity: fade }} className="relative z-10 px-6 text-center">
        <h1 className="font-display display-xl">
          {t.title.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.1em]">
              <motion.span className={`block ${i === 1 ? "italic text-blush" : ""}`} initial={{ y: "105%", opacity: 0, letterSpacing: "0.08em" }} animate={ready ? { y: 0, opacity: 1, letterSpacing: "-0.01em" } : {}} transition={{ duration: 1.8, ease, delay: d(0.5 + i * 0.35) }}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="mt-8 font-display text-3xl italic text-champagne md:text-5xl" initial={{ opacity: 0, filter: "blur(10px)" }} animate={ready ? { opacity: 1, filter: "blur(0px)" } : {}} transition={{ duration: 1.6, delay: d(1.8) }}>
          {t.name}
        </motion.p>
        <motion.p className="mt-3 tracking-soft text-xs text-blush/70 md:text-sm" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ duration: 1.6, delay: d(2.4) }}>
          {t.date}
        </motion.p>
      </motion.div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center" style={{ paddingBottom: "var(--sab)" }} initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: d(4), duration: 1.5 }}>
        <p className="font-hand text-lg text-blush/60">{t.scrollHint}</p>
        <div className="mx-auto mt-2 h-10 w-px bg-gradient-to-b from-blush/60 to-transparent" />
      </motion.div>
    </section>
  );
}
