"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { site } from "@/app/data/site";
import { lightPhotos } from "@/app/data/gallery";
import { ClipReveal, Fade, SplitWords } from "./Reveal";
import SafeImage from "./SafeImage";
import { ease } from "@/lib/utils";

function Editorial({ photo, className, shift, flip }: { photo: (typeof lightPhotos)[number]; className: string; shift: number; flip?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : shift, reduce ? 0 : -shift]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.0]);
  return (
    <figure ref={ref} className={className}>
      <motion.div style={{ y }} className="absolute inset-0">
        <ClipReveal from={flip ? "right" : "left"}>
          <motion.div style={{ scale }} className="absolute inset-0"><SafeImage src={photo.src} alt={photo.alt} sizes="(max-width: 768px) 90vw, 45vw" /></motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
        </ClipReveal>
      </motion.div>
      {photo.caption && <figcaption className="absolute -bottom-9 left-0 font-hand text-lg text-blush/80">{photo.caption}</figcaption>}
    </figure>
  );
}

export default function HerSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-night via-plum to-wine px-6 py-24 md:px-16" aria-label={site.her.title}>
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display display-xl text-center"><SplitWords text={site.her.title} stagger={0.14} /></h2>

        <div className="mt-16 grid items-start gap-y-24 md:grid-cols-12">
          <Editorial photo={lightPhotos[0]} className="relative aspect-[3/4] md:col-span-5" shift={50} />
          <div className="flex flex-col gap-10 md:col-span-6 md:col-start-7 md:mt-40">
            {site.her.words.slice(0, 4).map((w, i) => (
              <Fade key={w} delay={i * 0.05}><p className="font-display display-md italic text-blush">{w}</p></Fade>
            ))}
          </div>

          <div className="flex flex-col gap-10 md:col-span-5 md:col-start-1 md:mt-12 md:items-end md:text-right">
            {site.her.words.slice(4, 6).map((w) => (
              <Fade key={w}><p className="font-display display-md italic text-champagne">{w}</p></Fade>
            ))}
          </div>
          <Editorial photo={lightPhotos[1]} className="relative aspect-[4/5] md:col-span-6 md:col-start-7 md:-mt-24" shift={80} flip />

          <Editorial photo={lightPhotos[2]} className="relative aspect-[16/10] md:col-span-8 md:col-start-3" shift={40} />
        </div>

        <div className="mx-auto mt-24 max-w-3xl text-center">
          <h3 className="font-display display-lg text-ivory"><SplitWords text={site.her.words[6]} stagger={0.1} /></h3>
        </div>
      </div>
    </section>
  );
}
