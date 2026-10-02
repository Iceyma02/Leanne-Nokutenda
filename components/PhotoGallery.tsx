"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { herPhotos, usPhotos, type Photo } from "@/app/data/gallery";
import { Rich, ease, lockScroll } from "@/lib/utils";
import SafeImage from "./SafeImage";

const sets = { her: { label: "Her", photos: herPhotos }, us: { label: "Our Moments", photos: usPhotos } } as const;
const ratios = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[4/5]"];

function Lightbox({ photos, index, setIndex, tab, onClose }: { photos: Photo[]; index: number; setIndex: (i: number) => void; tab: string; onClose: () => void }) {
  const go = useCallback((d: number) => setIndex((index + d + photos.length) % photos.length), [index, photos.length, setIndex]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go, onClose]);
  const p = photos[index];
  return (
    <motion.div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-night/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <button onClick={onClose} aria-label="Close" className="focus-ring absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white" style={{ marginTop: "var(--sat)" }}><X /></button>
      <motion.div key={index} layoutId={`${tab}-${index}`} className="relative h-[68svh] w-[92vw] max-w-4xl cursor-grab" transition={{ duration: 0.9, ease }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.5}
        onDragEnd={(_, i) => { if (i.offset.x < -70) go(1); else if (i.offset.x > 70) go(-1); }} onClick={(e) => e.stopPropagation()}>
        <SafeImage src={p.src} alt={p.alt} sizes="92vw" priority className="!object-contain" />
      </motion.div>
      <div className="mt-5 px-6 text-center" onClick={(e) => e.stopPropagation()}>
        {p.caption && <p className="font-hand text-2xl text-blush"><Rich text={p.caption} /></p>}
        {p.date && <p className="text-xs tracking-soft text-champagne/70">{p.date}</p>}
        <p className="mt-1 text-xs text-blush/40">{index + 1} / {photos.length}</p>
      </div>
      {[-1, 1].map((d) => (
        <button key={d} onClick={(e) => { e.stopPropagation(); go(d); }} aria-label={d < 0 ? "Previous photo" : "Next photo"} className={`focus-ring absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white md:flex ${d < 0 ? "left-6" : "right-6"}`}>
          {d < 0 ? <ChevronLeft /> : <ChevronRight />}
        </button>
      ))}
    </motion.div>
  );
}

export default function PhotoGallery() {
  const [tab, setTab] = useState<keyof typeof sets>("her");
  const [open, setOpen] = useState<number | null>(null);
  const photos = sets[tab].photos;
  useEffect(() => { lockScroll(open !== null); return () => lockScroll(false); }, [open]);

  return (
    <section className="relative bg-gradient-to-b from-night to-plum px-4 py-24 md:px-12" aria-label="Photo gallery">
      <h2 className="text-center font-display display-lg">Frames I keep</h2>
      <div className="mt-8 flex justify-center gap-3" role="tablist">
        {(Object.keys(sets) as (keyof typeof sets)[]).map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`focus-ring min-h-11 rounded-full border px-6 text-sm tracking-widest ${tab === k ? "border-heart bg-heart/20 text-white" : "border-blush/20 text-blush/70"}`}>{sets[k].label}</button>
        ))}
      </div>
      <div className="mx-auto mt-14 max-w-6xl columns-2 gap-3 md:columns-3 md:gap-5">
        {photos.map((p, i) => (
          <motion.button key={`${tab}-${i}`} layoutId={`${tab}-${i}`} onClick={() => setOpen(i)} data-cursor="view" aria-label={`Open photo ${i + 1}`}
            className={`focus-ring group relative mb-3 block w-full overflow-hidden md:mb-5 ${ratios[i % ratios.length]}`}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 1.1, ease, delay: (i % 3) * 0.1 }}>
            <SafeImage src={p.src} alt={p.alt} sizes="(max-width: 768px) 50vw, 33vw" className="transition-transform duration-[1400ms] group-hover:scale-105" />
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{open !== null && <Lightbox photos={photos} index={open} setIndex={setOpen} tab={tab} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
