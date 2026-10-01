"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/app/data/site";
import { letter } from "@/app/data/messages";
import { Rich, ease } from "@/lib/utils";
import { Fade } from "./Reveal";

export default function LoveLetter() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.55, 0]);
  return (
    <section ref={ref} className="paper relative px-6 py-36 text-night md:px-16" aria-label={site.letter.title}>
      <motion.div aria-hidden style={{ opacity: glow }} className="pointer-events-none absolute left-1/2 top-1/3 h-[60vmax] w-[60vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,210,150,.55),transparent_65%)]" />
      <div className="relative mx-auto max-w-2xl">
        <Fade className="text-center">
          <h2 className="font-display display-lg text-burgundy">{site.letter.title}</h2>
          <div className="mx-auto mt-8 h-px w-24 bg-gold/70" />
        </Fade>
        <div className="mt-24 space-y-20">
          {letter.map((b) => (
            <motion.article key={b.label} initial={{ opacity: 0, y: 30, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 1.6, ease }}>
              <p className="font-hand text-2xl text-rose">{b.label}</p>
              <p className="mt-3 font-display text-2xl leading-[1.75] text-wine md:text-[1.7rem]"><Rich text={b.text} /></p>
            </motion.article>
          ))}
        </div>
        <Fade className="mt-28 text-right">
          <p className="font-hand text-4xl text-burgundy">{site.letter.signoff},</p>
          {site.finale.signature && <p className="mt-1 font-hand text-3xl text-rose">{site.finale.signature}</p>}
        </Fade>
      </div>
    </section>
  );
}
