"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/app/data/site";
import { future } from "@/app/data/messages";
import { ease } from "@/lib/utils";
import { Fade } from "./Reveal";

export default function FutureTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 70%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section className="relative bg-gradient-to-b from-night via-plum to-night px-6 py-32 md:px-16" aria-label={site.future.title}>
      <Fade className="text-center"><h2 className="font-display display-lg">{site.future.title}</h2></Fade>
      <div ref={ref} className="relative mx-auto mt-24 max-w-3xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-blush/10 md:left-1/2" />
        <motion.div style={{ scaleY: fill }} className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-heart via-rose to-champagne md:left-1/2" aria-hidden />
        <ol className="space-y-16">
          {future.map((f, i) => (
            <motion.li key={f.title} initial={{ opacity: 0, x: i % 2 ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 1.1, ease }} className={`relative pl-12 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}>
              <span aria-hidden className={`absolute top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-heart shadow-[0_0_18px_6px_rgba(255,61,127,.55)] left-4 ${i % 2 ? "md:left-0" : "md:left-full"}`} />
              <h3 className="font-display text-3xl italic text-blush md:text-4xl">{f.title}</h3>
              <p className="mt-1 text-blush/70">{f.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="mx-auto mt-40 max-w-3xl space-y-8 text-center">
        <Fade><p className="font-display display-md text-ivory">{site.future.closing[0]}</p></Fade>
        <Fade delay={0.8}><p className="font-display display-lg italic text-champagne">{site.future.closing[1]}</p></Fade>
      </div>
    </section>
  );
}
