"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Maximize, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { videos, type Video } from "@/app/data/videos";
import { lockScroll } from "@/lib/utils";
import { useMusic } from "@/lib/audio";

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
    <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-night/95 p-3 md:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={video.title || "Video"}>
      <button onClick={onClose} aria-label="Close video" className="focus-ring absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white" style={{ marginTop: "var(--sat)" }}><X /></button>
      <div className="relative w-full max-w-5xl overflow-hidden rounded-sm bg-black shadow-[0_30px_120px_-20px_rgba(255,61,127,.35)]">
        {err ? (
          <div className="flex aspect-video items-center justify-center p-8 text-center font-hand text-2xl text-blush/70">Video not found</div>
        ) : (
          <video ref={ref} src={video.src} playsInline preload="metadata" autoPlay className="aspect-video w-full bg-black"
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

function AutoVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const seen = useRef(false);
  const [ratio, setRatio] = useState(3 / 4);
  const [load, setLoad] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const { quiet } = useMusic();

  useEffect(() => {
    const v = ref.current; if (!v) return;
    v.muted = true;
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) setLoad(true); }, { rootMargin: "700px 0px" });
    const watch = new IntersectionObserver(([e]) => {
      seen.current = e.isIntersecting;
      if (e.isIntersecting) { void v.play().catch(() => undefined); }
      else { v.pause(); if (!v.muted) { v.muted = true; setMuted(true); quiet(false); } }
    }, { threshold: 0.35 });
    near.observe(v); watch.observe(v);
    return () => { near.disconnect(); watch.disconnect(); };
  }, [quiet]);

  const toggleSound = () => {
    const v = ref.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted); quiet(!v.muted);
    if (v.paused) void v.play().catch(() => undefined);
  };

  return (
    <motion.div
      className="relative overflow-hidden bg-plum [--vh-h:46svh] md:[--vh-h:60svh]"
      style={{ aspectRatio: ratio, width: `min(100%, calc(var(--vh-h) * ${ratio}))` }}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.1 }}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center font-hand text-xl text-blush/60">Video not found</div>
      ) : (
        <video
          ref={ref} src={load ? src : undefined} loop muted playsInline preload="auto" disablePictureInPicture aria-label="Video"
          className="absolute inset-0 h-full w-full object-cover"
          onLoadedMetadata={(e) => { const { videoWidth: w, videoHeight: h } = e.currentTarget; if (w && h) setRatio(w / h); }}
          onLoadedData={(e) => { if (seen.current) void e.currentTarget.play().catch(() => undefined); }}
          onError={() => load && setFailed(true)}
        />
      )}
      {!failed && (
        <button onClick={toggleSound} aria-label={muted ? "Turn sound on" : "Turn sound off"} className="focus-ring absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-night/55 text-white backdrop-blur">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}
    </motion.div>
  );
}

export default function VideoGallery() {
  return (
    <section className="relative bg-night px-4 py-32 md:px-12" aria-label="Videos">
      <h2 className="text-center font-display display-lg">Moments in motion</h2>
      <div className="mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-center gap-4 md:gap-8">
        {videos.map((v) => <AutoVideo key={v.src} src={v.src} />)}
      </div>
    </section>
  );
}
