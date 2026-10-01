"use client";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useMusic } from "@/lib/audio";

export default function MusicPlayer({ visible }: { visible: boolean }) {
  const { playing, muted, available, toggle, toggleMute } = useMusic();
  if (!visible || !available) return null;
  return (
    <div className="fixed z-50 flex items-center gap-1 rounded-full border border-blush/20 bg-night/55 px-2 py-1.5 text-blush backdrop-blur-md" style={{ right: "max(1rem, env(safe-area-inset-right))", bottom: "max(1rem, calc(env(safe-area-inset-bottom) + .5rem))" }} role="group" aria-label="Music controls">
      <button onClick={toggle} aria-label={playing ? "Pause music" : "Play music"} className="focus-ring flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10" data-cursor="magnetic">
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex h-5 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="w-[3px] origin-bottom rounded-full bg-heart/80" style={{ height: "100%", transform: "scaleY(.25)", animation: playing && !muted ? `bars ${0.7 + i * 0.17}s ease-in-out ${i * 0.1}s infinite` : "none" }} />
        ))}
      </div>
      <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="focus-ring flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10" data-cursor="magnetic">
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}
