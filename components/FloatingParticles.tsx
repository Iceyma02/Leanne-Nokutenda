"use client";
import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; r: number; vy: number; vx: number; a: number; p: number; heart: boolean };

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.5, y - s, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.5, y - s, x + s, y - s * 0.3, x, y + s * 0.35);
  ctx.fill();
}

/** Light, canvas-based atmosphere: dust + a few tiny hearts. Pauses when off-screen. */
export default function FloatingParticles({ count = 40, color = "255,170,195", hearts = 0.12, className = "", rise = true }: { count?: number; color?: string; hearts?: number; className?: string; rise?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, dots: Dot[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const n = reduce ? Math.floor(count / 3) : count;
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (): Dot => ({
      x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.8,
      vy: (rise ? -1 : 1) * (4 + Math.random() * 12), vx: (Math.random() - 0.5) * 6,
      a: 0.15 + Math.random() * 0.5, p: Math.random() * 6.28, heart: Math.random() < hearts,
    });
    resize(); dots = Array.from({ length: n }, spawn);
    let last = performance.now();
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) { last = t; return; }
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduce) { d.y += d.vy * dt; d.x += (d.vx + Math.sin(t / 1800 + d.p) * 5) * dt; }
        if (d.y < -10) d.y = h + 10; if (d.y > h + 10) d.y = -10;
        const tw = 0.6 + 0.4 * Math.sin(t / 900 + d.p);
        ctx.fillStyle = `rgba(${color},${d.a * tw})`;
        if (d.heart) heart(ctx, d.x, d.y, d.r * 4.5);
        else { ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill(); }
      }
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(c);
    const ro = new ResizeObserver(resize); ro.observe(c);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [count, color, hearts, rise]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
