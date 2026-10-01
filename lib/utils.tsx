"use client";
import { Fragment, useEffect, useState } from "react";

/** Highlights [BRACKETED] placeholders so you can spot what still needs replacing. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className="placeholder">{p}</span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

export const ease = [0.22, 1, 0.36, 1] as const;

export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const set = () => setTouch(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return touch;
}

export const lockScroll = (lock: boolean) => {
  document.documentElement.classList.toggle("scroll-locked", lock);
  (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis?.[lock ? "stop" : "start"]();
};
