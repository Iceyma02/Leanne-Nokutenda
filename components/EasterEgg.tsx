"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeartIcon from "./HeartIcon";

/** A tiny hidden heart. Tap it and a small message appears. Not announced anywhere. */
export default function EasterEgg({ message, className = "" }: { message: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const show = () => { setOpen(true); window.setTimeout(() => setOpen(false), 3800); };
  return (
    <div className={`absolute z-20 ${className}`}>
      <button onClick={show} aria-label="A small surprise" data-cursor="heart" className="focus-ring flex h-11 w-11 items-center justify-center opacity-25 transition-opacity hover:opacity-90 focus-visible:opacity-90">
        <HeartIcon size={14} glow={false} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p role="status" initial={{ opacity: 0, y: 6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-full w-max max-w-[70vw] -translate-x-1/2 rounded-full bg-night/80 px-4 py-2 font-hand text-lg text-blush backdrop-blur">
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
