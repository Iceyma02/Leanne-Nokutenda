"use client";
import Image from "next/image";
import { useState } from "react";

/** Next/Image that falls back to a soft rose placeholder if the file is missing. */
export default function SafeImage({
  src, alt, sizes = "(max-width: 768px) 100vw, 50vw", priority = false, className = "", label = "Add your photo here",
}: { src: string; alt: string; sizes?: string; priority?: boolean; className?: string; label?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-wine via-plum to-burgundy/70 ${className}`} role="img" aria-label={alt}>
        <span className="font-hand text-xl text-blush/50 px-4 text-center">{label}</span>
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} onError={() => setFailed(true)} />;
}
