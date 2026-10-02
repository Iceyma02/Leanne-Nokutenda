"use client";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/utils";

/** Word-by-word blur-to-sharp reveal. Use for the few lines that deserve it. */
export function SplitWords({ text, className = "", delay = 0, stagger = 0.07, once = true }: { text: string; className?: string; delay?: number; stagger?: number; once?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.span className={className} initial="h" whileInView="v" viewport={{ once, amount: 0.6 }} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{ h: { y: reduce ? 0 : "110%", opacity: 0, filter: reduce ? "none" : "blur(8px)" }, v: { y: 0, opacity: 1, filter: "blur(0px)" } }}
            transition={{ duration: 1.1, ease, delay: delay + i * stagger }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Fade({ children, className = "", delay = 0, y = 24 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={{ opacity: 0, y: reduce ? 0 : y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.2, ease, delay }}>
      {children}
    </motion.div>
  );
}

const HIDDEN = { bottom: "inset(100% 0 0 0)", top: "inset(0 0 100% 0)", left: "inset(0 100% 0 0)", right: "inset(0 0 0 100%)" };

/**
 * Masked photo reveal. The OBSERVED wrapper is never clipped (a fully clipped element can
 * report "not visible" and would stay blank forever), only the inner layer is.
 * Give `className` positioning/sizing, e.g. "absolute inset-0" or "relative aspect-[4/5]".
 */
export function ClipReveal({ children, className = "absolute inset-0", from = "bottom", duration = 1.6, delay = 0 }: { children: React.ReactNode; className?: string; from?: keyof typeof HIDDEN; duration?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className={className}>
      <motion.div className="absolute inset-0 overflow-hidden" initial={{ clipPath: HIDDEN[from] }} animate={{ clipPath: inView || reduce ? "inset(0% 0% 0% 0%)" : HIDDEN[from] }} transition={{ duration, ease, delay }}>
        {children}
      </motion.div>
    </div>
  );
}
