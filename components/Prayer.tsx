"use client";
import { motion } from "framer-motion";
import { site } from "@/app/data/site";
import { prayer } from "@/app/data/messages";
import FloatingParticles from "./FloatingParticles";

/** The calmest part of the site: ivory, champagne, tiny gold dust, no scroll tricks. */
export default function Prayer() {
  return (
    <section className="paper relative overflow-hidden px-8 py-40 text-wine" aria-label="Prayer">
      <FloatingParticles count={22} color="191,160,100" hearts={0} className="opacity-70" />
      <div className="relative mx-auto max-w-2xl text-center">
        <motion.h2 className="font-display display-lg text-burgundy" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2.4 }}>{site.prayer.title}</motion.h2>
        <div className="mx-auto mt-10 h-px w-16 bg-gold/70" />
        <div className="mt-24 space-y-14">
          {prayer.map((line) => (
            <motion.p key={line} className="font-display text-2xl leading-[1.8] md:text-3xl" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 2.6, ease: "easeOut" }}>{line}</motion.p>
          ))}
        </div>
        <motion.p className="mt-24 font-display text-4xl italic text-burgundy" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 1 }} transition={{ duration: 3 }}>{site.prayer.amen}</motion.p>
      </div>
    </section>
  );
}
