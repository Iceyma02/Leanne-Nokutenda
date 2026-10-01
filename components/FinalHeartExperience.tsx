"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { site } from "@/app/data/site";
import { ease, lockScroll } from "@/lib/utils";
import { useMusic } from "@/lib/audio";
import HeartIcon from "./HeartIcon";
import HeartStormCanvas, { type StormHandle } from "./HeartStormCanvas";
import FloatingParticles from "./FloatingParticles";

type Stage = "quiet" | "anticipation" | "storm" | "done";

/**
 * Timeline (ms after tap, scaled down for reduced motion):
 *  0–1500 anticipation · 1500 first burst · 1900 hearts appear · 6000 multiply · 13500 EXPLOSION
 *  15500 screen fills + pile · 22500 FREEZE (1.2s) · 23700 reveal · messages · ~37000 settle into the final scene
 */
export default function FinalHeartExperience() {
  const reduce = useReducedMotion();
  const storm = useRef<StormHandle>(null);
  const root = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const heart = useAnimationControls();
  const { quiet } = useMusic();
  const [stage, setStage] = useState<Stage>("quiet");
  const [dark, setDark] = useState(0);
  const [flash, setFlash] = useState(false);
  const [shown, setShown] = useState(0);
  const [taps, setTaps] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => { if (stage === "quiet") quiet(inView); }, [inView, stage, quiet]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); lockScroll(false); }, []);

  const at = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms * (reduce ? 0.45 : 1))); };

  const begin = () => {
    if (stage !== "quiet") return;
    setStage("anticipation");
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o: object) => void } }).__lenis;
    if (root.current) { if (lenis) lenis.scrollTo(root.current, { duration: 0.9 }); else root.current.scrollIntoView({ behavior: "smooth" }); }
    at(1000, () => lockScroll(true));
    const m = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    storm.current?.setLimit(m ? (reduce ? 160 : 380) : reduce ? 260 : 650);

    // anticipation: pulse → stronger → glow → darken → silence → expand
    void heart.start({ scale: [1, 1.12, 1, 1.2, 1.05, 1.35, 1.2, 1.5, 14], opacity: [1, 1, 1, 1, 1, 1, 1, 1, 0], transition: { duration: 1.5 * (reduce ? 0.45 : 1), times: [0, 0.1, 0.2, 0.32, 0.42, 0.56, 0.72, 0.86, 1], ease: "easeInOut" } });
    at(300, () => setDark(0.15)); at(900, () => setDark(0.45)); at(1100, () => setDark(0.6));
    at(1500, () => { setStage("storm"); setDark(0); setFlash(true); quiet(false); storm.current?.burst(reduce ? 50 : 110, 800, 0.2); });
    at(1700, () => setFlash(false));
    at(1900, () => storm.current?.setRate(6));            // phase 1: first hearts, slow
    at(6000, () => storm.current?.setRate(38));           // phase 2: multiply
    at(10500, () => storm.current?.setRate(75));
    at(13500, () => { setFlash(true); storm.current?.burst(m ? 260 : 440, 1150, 0.6); storm.current?.setRate(55); });   // phase 3: explosion
    at(13800, () => setFlash(false));
    at(15500, () => { storm.current?.setRate(120); storm.current?.setFloor(0.1); });  // phase 4: fills
    at(17500, () => storm.current?.setFloor(0.22)); at(19500, () => storm.current?.setFloor(0.34)); at(21200, () => storm.current?.setFloor(0.44));
    at(22500, () => storm.current?.freeze(true));         // phase 5: freeze
    at(23800, () => { storm.current?.freeze(false); storm.current?.setRate(28); storm.current?.reveal(true); storm.current?.releasePile(); }); // phase 6: reveal
    at(25000, () => setShown(1)); at(28500, () => setShown(2)); at(31500, () => setShown(3)); at(35000, () => setShown(4));
    at(38000, () => { setStage("done"); lockScroll(false); storm.current?.setRate(16); });
  };

  const m = site.finale.messages;
  const rise = { initial: { opacity: 0, y: 14, filter: "blur(10px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { duration: 1.6, ease } };

  return (
    <section ref={root} className="relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden bg-night grain" aria-label="Finale">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(90,22,48,.5), transparent 60%)" }} />
      {stage === "quiet" && <FloatingParticles count={18} hearts={0} />}

      <HeartStormCanvas ref={storm} />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" animate={{ opacity: dark }} transition={{ duration: 0.5 }} />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,235,242,.9),rgba(255,90,150,.4)_50%,transparent_75%)]" animate={{ opacity: flash ? 0.55 : 0 }} transition={{ duration: flash ? 0.12 : 0.9 }} />

      {stage !== "storm" && stage !== "done" && (
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {stage === "quiet" && (
            <>
              <motion.p className="font-display display-md italic text-champagne" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.2 }}>{site.finale.prelude}</motion.p>
              <motion.p className="mt-6 font-hand text-3xl text-blush" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 2.4 }}>{site.finale.prompt}</motion.p>
            </>
          )}
          <motion.button onClick={begin} disabled={stage !== "quiet"} aria-label="Tap the heart" data-cursor="heart" className="focus-ring relative mt-10 flex h-36 w-36 items-center justify-center rounded-full" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 3.2 }}>
            <motion.span aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,61,127,.55),transparent_70%)]" animate={{ scale: stage === "anticipation" ? [1, 2.4, 4.5] : [1, 1.3, 1], opacity: stage === "anticipation" ? [0.6, 1, 0] : [0.5, 0.9, 0.5] }} transition={{ duration: stage === "anticipation" ? 1.5 : 1.6, repeat: stage === "anticipation" ? 0 : Infinity }} />
            <Orbiters />
            <motion.div animate={heart} className={stage === "quiet" ? "beat" : ""}><HeartIcon size={84} /></motion.div>
          </motion.button>
        </div>
      )}

      {(stage === "storm" || stage === "done") && shown > 0 && (
        <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center" style={{ textShadow: "0 0 30px rgba(10,4,8,.9), 0 0 60px rgba(10,4,8,.8)" }}>
          <div aria-hidden className="absolute -inset-x-10 -inset-y-16 -z-10 rounded-full blur-2xl" style={{ background: "radial-gradient(ellipse, rgba(10,4,8,.7), transparent 70%)" }} />
          <motion.h2 {...rise} className="font-display display-lg text-white pointer-events-auto" data-cursor="heart" onClick={() => setTaps((t) => t + 1)}>{m[0]}</motion.h2>
          {shown > 1 && <motion.p {...rise} className="mt-6 font-display display-md italic text-blush">{m[1]}</motion.p>}
          {shown > 2 && <motion.p {...rise} className="mt-6 max-w-xl font-display text-xl text-ivory md:text-2xl">{m[2]}</motion.p>}
          {shown > 3 && <motion.p {...rise} className="mt-8 font-hand text-3xl text-champagne">{m[3]}</motion.p>}
          {taps >= 5 && <motion.p {...rise} className="mt-6 font-hand text-2xl text-heart">{site.easterEggs.konami}</motion.p>}
        </div>
      )}

      {stage === "done" && (
        <motion.p className="absolute inset-x-0 text-center font-hand text-xl text-blush/70" style={{ bottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}>
          {site.finale.footer} {site.finale.signature}
        </motion.p>
      )}
    </section>
  );
}

function Orbiters() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} aria-hidden className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-blush shadow-[0_0_8px_3px_rgba(255,160,190,.7)]" style={{ marginLeft: -3, marginTop: -3 }}
          animate={{ x: [0, 1, 0, -1, 0].map((f) => f * (66 + i * 6)), y: [-1, 0, 1, 0, -1].map((f) => f * (66 + i * 6)) }} transition={{ duration: 5 + i, repeat: Infinity, ease: "linear", delay: -i }} />
      ))}
    </>
  );
}
