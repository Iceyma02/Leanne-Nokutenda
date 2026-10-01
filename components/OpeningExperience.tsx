"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/app/data/site";
import { ease } from "@/lib/utils";
import FloatingParticles from "./FloatingParticles";
import MagneticButton from "./MagneticButton";
import HeartIcon from "./HeartIcon";

/** Cinematic timing: each line is shown for a beat, then the button arrives. */
export default function OpeningExperience({ onOpen }: { onOpen: () => void }) {
  const [step, setStep] = useState(-1);
  const [opening, setOpening] = useState(false);
  const lines = site.opening.lines;

  useEffect(() => {
    const times = [1400, 3800, 6000, 7600, 9200];
    const ids = times.map((t, i) => window.setTimeout(() => setStep(i), t));
    return () => ids.forEach(clearTimeout);
  }, []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onOpen(); // unlocks audio within the user gesture
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] grain overflow-hidden bg-night"
      exit={{ opacity: 0, filter: "blur(14px)", scale: 1.06 }} transition={{ duration: 1.8, ease }}
      style={{ paddingTop: "var(--sat)", paddingBottom: "var(--sab)" }}
    >
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(110,20,55,.35), transparent 60%)" }} />
      <motion.div className="absolute inset-0" animate={opening ? { scale: 1.8, opacity: 0 } : { scale: 1 }} transition={{ duration: 1.6, ease }}>
        <FloatingParticles count={50} hearts={0.06} />
      </motion.div>

      {/* light that expands from the button */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className="absolute left-1/2 top-[62%] aspect-square w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,235,240,.95), rgba(255,100,150,.55) 35%, transparent 70%)" }}
            initial={{ scale: 0, opacity: 0.9 }} animate={{ scale: 6, opacity: 1 }} transition={{ duration: 1.5, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: opening ? 1 : 1, scale: opening ? [1, 1.5, 1.2] : 1 }} transition={{ duration: opening ? 0.9 : 2, ease }}>
          <HeartIcon size={38} className="beat" />
        </motion.div>

        <div className="mt-10 min-h-[11rem] md:min-h-[13rem]">
          <AnimatePresence mode="wait">
            {step >= 0 && step < 3 && (
              <motion.p
                key={step} className={step === 2 ? "display-lg font-display italic" : "display-md font-display"}
                initial={{ opacity: 0, filter: "blur(10px)", y: 12 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 1.3, ease }}
              >
                {lines[step]}
              </motion.p>
            )}
            {step >= 3 && (
              <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: opening ? 0 : 1 }} transition={{ duration: 1.2 }}>
                <p className="display-lg font-display italic">{lines[2]}</p>
                <p className="mt-3 tracking-soft text-sm text-champagne">{lines[3]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div className="mt-10" initial={{ opacity: 0, y: 16 }} animate={step >= 4 ? { opacity: opening ? 0.9 : 1, y: 0 } : {}} transition={{ duration: 1.4, ease }}>
          {step >= 4 && <MagneticButton onClick={open}>{site.opening.button}</MagneticButton>}
        </motion.div>
      </div>
    </motion.div>
  );
}
