"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { memories, type Memory } from "@/app/data/memories";
import { Rich, ease } from "@/lib/utils";
import SafeImage from "./SafeImage";
import { VideoPlayerModal } from "./VideoGallery";

function Moment({ m, i, onVideo }: { m: Memory; i: number; onVideo: (src: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 70, reduce ? 0 : -70]);
  const rotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : i % 2 ? 3 : -3, 0]);
  const right = i % 2 === 1;
  const hasText = Boolean(m.title || m.description || m.date || m.quote);
  return (
    <div ref={ref} className={`relative grid items-center gap-8 py-16 md:gap-20 md:py-28 ${hasText ? `md:grid-cols-2 ${right ? "md:[&>*:first-child]:order-2" : ""}` : right ? "md:pl-[30%]" : "md:pr-[30%]"}`}>
      <motion.div style={{ y, rotate }} className="relative mx-auto aspect-[4/5] w-full max-w-md" data-cursor="view">
        <motion.div className="absolute inset-0 overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]" initial={{ clipPath: "inset(100% 0 0 0)" }} whileInView={{ clipPath: "inset(0% 0 0 0)" }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.6, ease }}>
          <SafeImage src={m.image} alt={m.title || "A memory of us"} sizes="(max-width: 768px) 90vw, 40vw" />
        </motion.div>
        {m.video && (
          <button onClick={() => onVideo(m.video!)} aria-label="Watch video" className="focus-ring absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-night/50 backdrop-blur"><Play size={18} className="ml-0.5" /></button>
        )}
      </motion.div>
      {hasText && <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.2, ease, delay: 0.2 }} className={right ? "md:text-right" : ""}>
        {m.date && <p className="font-hand text-2xl text-champagne"><Rich text={m.date} /></p>}
        {m.title && <h3 className="mt-2 font-display display-md text-ivory"><Rich text={m.title} /></h3>}
        {m.description && <p className="mt-5 max-w-md text-blush/80 md:inline-block"><Rich text={m.description} /></p>}
        {m.quote && <p className="mt-6 border-l border-heart/60 pl-4 font-display text-xl italic text-blush md:max-w-md"><Rich text={m.quote} /></p>}
      </motion.div>}
    </div>
  );
}

/** Horizontal "film strip" moment: vertical scroll drives a sideways pan. */
function FilmStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-72%"]);
  return (
    <div ref={ref} className="relative h-[280vh]" aria-hidden>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6 pl-6 md:gap-10">
          {[...memories, ...memories].map((m, i) => (
            <div key={i} className="relative h-[52svh] w-[62vw] shrink-0 overflow-hidden md:w-[28vw]" style={{ transform: `translateY(${i % 2 ? 28 : -28}px) rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
              <SafeImage src={m.image} alt="" sizes="30vw" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function MemoryTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [video, setVideo] = useState<string | null>(null);
  return (
    <div>
      <div ref={ref} className="relative mx-auto max-w-6xl px-6 md:px-12">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-blush/10 md:block" />
        <motion.div style={{ scaleY: line }} className="absolute bottom-0 left-1/2 top-0 hidden w-px origin-top -translate-x-1/2 bg-gradient-to-b from-heart to-champagne md:block" aria-hidden />
        {memories.map((m, i) => <Moment key={m.id} m={m} i={i} onVideo={setVideo} />)}
      </div>
      <FilmStrip />
      <AnimatePresence>{video && <VideoPlayerModal video={{ src: video }} onClose={() => setVideo(null)} />}</AnimatePresence>
    </div>
  );
}
