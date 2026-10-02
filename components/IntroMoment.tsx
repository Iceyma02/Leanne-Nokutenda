import { site } from "@/app/data/site";
import { Fade, SplitWords } from "./Reveal";

/** Deliberately quiet. A single sentence, lots of dark. */
export default function IntroMoment() {
  return (
    <section className="flex min-h-[85svh] py-20 flex-col items-center justify-center bg-night px-8 text-center">
      <Fade><p className="font-hand text-2xl text-champagne/80 md:text-3xl">{site.intro.before}</p></Fade>
      <h2 className="font-display display-lg mt-14 max-w-4xl text-ivory">
        <SplitWords text={site.intro.line} delay={0.6} stagger={0.12} />
      </h2>
    </section>
  );
}
