"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { AudioProvider, useMusic } from "@/lib/audio";
import { lockScroll } from "@/lib/utils";
import { site } from "@/app/data/site";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import OpeningExperience from "@/components/OpeningExperience";
import Hero from "@/components/Hero";
import IntroMoment from "@/components/IntroMoment";
import HerSection from "@/components/HerSection";
import SpecialQualities from "@/components/SpecialQualities";
import OurStory from "@/components/OurStory";
import LoveLetter from "@/components/LoveLetter";
import Encouragement from "@/components/Encouragement";
import FutureTimeline from "@/components/FutureTimeline";
import Prayer from "@/components/Prayer";
import MusicPlayer from "@/components/MusicPlayer";
import SectionTransition from "@/components/SectionTransition";

// heavy / interaction-driven pieces load on demand, client-side only
const PhotoGallery = dynamic(() => import("@/components/PhotoGallery"), { ssr: false });
const MemoryWall = dynamic(() => import("@/components/MemoryWall"), { ssr: false });
const VideoGallery = dynamic(() => import("@/components/VideoGallery"), { ssr: false });
const FinalHeartExperience = dynamic(() => import("@/components/FinalHeartExperience"), { ssr: false });

/** A single, rare "I love you" that drifts in while she scrolls. */
function OccasionalLove({ on }: { on: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => { setShow(true); window.setTimeout(() => setShow(false), 3200); }, 55000);
    return () => clearInterval(id);
  }, [on]);
  return (
    <AnimatePresence>
      {show && <motion.p aria-hidden initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.85, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }} className="pointer-events-none fixed left-1/2 top-[14%] z-40 -translate-x-1/2 font-hand text-3xl text-blush" style={{ textShadow: "0 0 20px rgba(255,61,127,.6)" }}>{site.easterEggs.occasional}</motion.p>}
    </AnimatePresence>
  );
}

function Experience() {
  const [opened, setOpened] = useState(false);
  const { start } = useMusic();

  useEffect(() => {
    window.history.scrollRestoration = "manual"; window.scrollTo(0, 0);
    lockScroll(true);
  }, []);

  const open = () => {
    start(); // must run inside the tap so the browser allows audio
    window.setTimeout(() => { setOpened(true); lockScroll(false); }, 1300);
  };

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <AnimatePresence>{!opened && <OpeningExperience key="open" onOpen={open} />}</AnimatePresence>
      <main>
        <Hero ready={opened} />
        <IntroMoment />
        <HerSection />
        <SpecialQualities />
        <OurStory />
        <PhotoGallery />
        <MemoryWall />
        <VideoGallery />
        <SectionTransition from="plum" to="ivory" h={120} />
        <LoveLetter />
        <SectionTransition from="ivory" to="night" h={120} />
        <Encouragement />
        <FutureTimeline />
        <SectionTransition from="night" to="ivory" h={140} />
        <Prayer />
        <SectionTransition from="ivory" to="night" h={160} />
        <FinalHeartExperience />
      </main>
      <MusicPlayer visible={opened} />
      <OccasionalLove on={opened} />
    </>
  );
}

export default function Page() {
  return <AudioProvider><Experience /></AudioProvider>;
}
