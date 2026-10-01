"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/app/data/site";

type AudioCtx = {
  playing: boolean; muted: boolean; available: boolean;
  start: () => void; toggle: () => void; toggleMute: () => void; quiet: (q: boolean) => void;
};
const Ctx = createContext<AudioCtx | null>(null);
export const useMusic = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusic must be used inside AudioProvider");
  return c;
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const target = useRef(site.audio.volume);
  const raf = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const a = new Audio();
    a.src = site.audio.src; a.loop = true; a.preload = "none"; a.volume = 0;
    a.addEventListener("error", () => setAvailable(false));
    ref.current = a;
    return () => { cancelAnimationFrame(raf.current); a.pause(); a.src = ""; };
  }, []);

  const fade = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const step = () => {
      const a = ref.current; if (!a) return;
      const diff = target.current - a.volume;
      if (Math.abs(diff) < 0.01) { a.volume = Math.max(0, Math.min(1, target.current)); return; }
      a.volume = Math.max(0, Math.min(1, a.volume + diff * 0.06));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(() => {
    const a = ref.current; if (!a) return;
    a.load();
    a.play().then(() => { setPlaying(true); target.current = site.audio.volume; fade(); }).catch(() => setPlaying(false));
  }, [fade]);

  const toggle = useCallback(() => {
    const a = ref.current; if (!a) return;
    if (a.paused) start(); else { a.pause(); setPlaying(false); }
  }, [start]);

  const toggleMute = useCallback(() => {
    const a = ref.current; if (!a) return;
    a.muted = !a.muted; setMuted(a.muted);
  }, []);

  const quiet = useCallback((q: boolean) => {
    target.current = q ? site.audio.quietVolume : site.audio.volume; fade();
  }, [fade]);

  const value = useMemo(() => ({ playing, muted, available, start, toggle, toggleMute, quiet }), [playing, muted, available, start, toggle, toggleMute, quiet]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
