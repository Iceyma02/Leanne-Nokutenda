import { site } from "@/app/data/site";
import { Fade, SplitWords } from "./Reveal";
import MemoryTimeline from "./MemoryTimeline";

export default function OurStory() {
  return (
    <section className="relative bg-night" aria-label="Our story">
      <div className="flex min-h-[75svh] py-20 flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display display-xl"><SplitWords text={site.story.title} stagger={0.15} /></h2>
        <div className="mt-12 space-y-2">
          {site.story.lines.map((l, i) => (
            <Fade key={l} delay={0.3 + i * 0.5}><p className="font-display display-md italic text-champagne">{l}</p></Fade>
          ))}
        </div>
      </div>
      <MemoryTimeline />
    </section>
  );
}
