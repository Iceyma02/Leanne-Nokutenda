"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { videos, type Video } from "@/app/data/videos";
import { Rich, lockScroll } from "@/lib/utils";
import { useMusic } from "@/lib/audio";
import SafeImage from "./SafeImage";

export function VideoPlayerModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [p, setP] = useState(0);
  const [err, setErr] = useState(false);
  const { quiet } = useMusic();

  useEffect(() => {
    lockScroll(true); quiet(true);
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === " ") { e.preventDefault(); toggle(); } };
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); lockScroll(false); quiet(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => { const v = ref.current; if (!v) return; if (v.paused) void v.play(); else v.pause(); };
  const full = () => { const v = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null; if (!v) return; if (v.requestFullscreen) void v.requestFullscreen(); else v.webkitEnterFullscreen?.(); };

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-night/95 p-3 md:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={video.title}>
      <button onClick={onClose} aria-label="Close video" className="focus-ring absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white" style={{ marginTop: "var(--sat)" }}><X /></button>
      <div className="relative w-full max-w-5xl overflow-hidden rounded-sm bg-black shadow-[0_30px_120px_-20px_rgba(255,61,127,.35)]">
        {err ? (
          <div className="flex aspect-video items-center justify-center p-8 text-center font-hand text-2xl text-blush/70">Video not found. Add the file named in app/data/videos.ts</div>
        ) : (
          <video ref={ref} src={video.src} poster={video.poster} playsInline preload="metadata" autoPlay className="aspect-video w-full bg-black"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setErr(true)}
            onTimeUpdate={(e) => setP(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0)} onClick={toggle} />
        )}
        {!err && (
          <div className="flex items-center gap-2 bg-gradient-to-t from-black to-transparent px-3 pb-3 pt-6">
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="focus-ring flex h-11 w-11 items-center justify-center text-white">{playing ? <Pause size={20} /> : <Play size={20} />}</button>
            <input type="range" min={0} max={1000} value={Math.round(p * 1000)} aria-label="Seek" className="h-1 flex-1 accent-[#ff3d7f]" onChange={(e) => { const v = ref.current; if (v && v.duration) v.currentTime = (Number(e.target.value) / 1000) * v.duration; }} />
            <button onClick={() => { const v = ref.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }} aria-label={muted ? "Unmute" : "Mute"} className="focus-ring flex h-11 w-11 items-center justify-center text-white">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
            <button onClick={full} aria-label="Fullscreen" className="focus-ring flex h-11 w-11 items-center justify-center text-white"><Maximize size={18} /></button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function VideoGallery() {
  const [active, setActive] = useState<Video | null>(null);
  const [tab, setTab] = useState<"leanne" | "us">("leanne");
  const list = videos.filter((v) => v.group === tab);
  return (
    <section className="relative bg-night px-6 py-32 md:px-16" aria-label="Videos">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display display-lg">Moments in motion</h2>
        <div className="mt-8 flex justify-center gap-3" role="tablist">
          {(["leanne", "us"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`focus-ring min-h-11 rounded-full border px-6 text-sm tracking-widest ${tab === t ? "border-heart bg-heart/20 text-white" : "border-blush/20 text-blush/70"}`}>{t === "leanne" ? "Her" : "Us"}</button>
          ))}
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {list.map((v) => (
            <motion.button key={v.src} onClick={() => setActive(v)} data-cursor="view" className="focus-ring group relative aspect-video overflow-hidden text-left" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1 }} aria-label={`Play video: ${v.title}`}>
              <SafeImage src={v.poster} alt={v.title} label="Add your video poster here" className="transition-transform duration-[1500ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
              <div className="absolute bottom-4 left-5 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur"><Play size={18} className="ml-0.5" /></span><span className="font-display text-xl"><Rich text={v.title} /></span></div>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>{active && <VideoPlayerModal video={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
