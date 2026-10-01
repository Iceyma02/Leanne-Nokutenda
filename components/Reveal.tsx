"use client";
import { motion, useReducedMotion } from "framer-motion";
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
