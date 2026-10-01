"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Optimised heart storm. One canvas, pre-rendered sprites (no per-particle gradients or shadows),
 * 3 depth layers, capped particle counts, adaptive quality, paused when hidden/off-screen.
 * Driven from outside through the imperative handle below.
 */
export type StormHandle = {
  setRate: (perSecond: number) => void;
  burst: (n: number, power?: number, heartShare?: number) => void;
  freeze: (on: boolean) => void;
  setFloor: (fraction: number) => void;
  reveal: (on: boolean) => void;
  releasePile: () => void;
  setLimit: (n: number) => void;
  clear: () => void;
};

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; size: number; rot: number; vr: number; a: number; spr: number; age: number; ph: number; fk: number; settled: boolean; life: number; maxLife: number; kind: 0 | 1 | 2 };

const PALETTE: [string, string, string][] = [
  ["#ff9ec0", "#ff3d7f", "#b0124f"], ["#ffc2d4", "#ff6b9a", "#d0336b"], ["#ffe1ea", "#ffb3c8", "#e0668c"],
  ["#f6e3b8", "#d9c093", "#a8884f"], ["#ff5c93", "#d81b60", "#7d0b3a"],
];

function mk(size: number, draw: (c: CanvasRenderingContext2D, s: number) => void) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const x = c.getContext("2d"); if (x) draw(x, size);
  return c;
}
function path(c: CanvasRenderingContext2D, s: number, k: number) {
  const cx = s / 2, cy = s / 2 + s * 0.04;
  c.beginPath();
  c.moveTo(cx, cy + k * 0.62);
  c.bezierCurveTo(cx - k * 1.15, cy - k * 0.2, cx - k * 0.7, cy - k * 1.05, cx, cy - k * 0.5);
  c.bezierCurveTo(cx + k * 0.7, cy - k * 1.05, cx + k * 1.15, cy - k * 0.2, cx, cy + k * 0.62);
  c.closePath();
}
function buildSprites() {
  const hearts: HTMLCanvasElement[] = [], soft: HTMLCanvasElement[] = [];
  for (const [hi, mid, lo] of PALETTE) {
    hearts.push(mk(96, (c, s) => {
      path(c, s, 30); const g = c.createRadialGradient(s * 0.38, s * 0.34, 2, s / 2, s / 2, s * 0.5);
      g.addColorStop(0, hi); g.addColorStop(0.55, mid); g.addColorStop(1, lo); c.fillStyle = g; c.shadowColor = mid; c.shadowBlur = 8; c.fill();
    }));
    soft.push(mk(96, (c, s) => { path(c, s, 26); c.fillStyle = mid; c.globalAlpha = 0.6; c.shadowColor = mid; c.shadowBlur = 22; c.fill(); }));
  }
  const dot = mk(32, (c, s) => { const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, "rgba(255,240,245,1)"); g.addColorStop(0.35, "rgba(255,120,170,.7)"); g.addColorStop(1, "rgba(255,61,127,0)"); c.fillStyle = g; c.fillRect(0, 0, s, s); });
  const gold = mk(32, (c, s) => { const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, "rgba(255,250,230,1)"); g.addColorStop(0.35, "rgba(230,200,140,.7)"); g.addColorStop(1, "rgba(217,192,147,0)"); c.fillStyle = g; c.fillRect(0, 0, s, s); });
  const spark = mk(48, (c, s) => {
    c.translate(s / 2, s / 2); c.fillStyle = "#fff"; c.shadowColor = "#ffb3d0"; c.shadowBlur = 8; c.beginPath();
    for (let i = 0; i < 8; i++) { const r = i % 2 ? 3 : 20; const a = (i * Math.PI) / 4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill();
  });
  return { hearts, soft, fx: [dot, gold, spark] };
}

const HeartStormCanvas = forwardRef<StormHandle, { className?: string }>(function HeartStormCanvas({ className = "" }, ref) {
  const cv = useRef<HTMLCanvasElement>(null);
  const S = useRef({ rate: 0, scale: 1, floor: 0, reveal: false, limit: 600, settled: 0, acc: 0, layers: [[], [], []] as P[][], fx: [] as P[], w: 0, h: 0, dpr: 1, speed: 1, clearAll: false });

  useImperativeHandle(ref, () => ({
    setRate: (n) => { S.current.rate = n; },
    freeze: (on) => { S.current.scale = on ? 0 : 1; },
    setFloor: (f) => { S.current.floor = f; },
    setLimit: (n) => { S.current.limit = n; },
    reveal: (on) => { S.current.reveal = on; S.current.speed = on ? 0.5 : 1; },
    releasePile: () => { for (const L of S.current.layers) for (const p of L) if (p.settled) { p.settled = false; p.vy = -10 - Math.random() * 25; p.vx = (Math.random() - 0.5) * 30; } S.current.settled = 0; S.current.floor = 0; },
    clear: () => { S.current.layers.forEach((l) => (l.length = 0)); S.current.fx.length = 0; S.current.settled = 0; },
    burst: (n, power = 900, heartShare = 0.55) => {
      const s = S.current;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, sp = power * (0.15 + Math.random() * 0.85) * (0.6 + Math.random() * 0.4);
        const isHeart = Math.random() < heartShare;
        const layer = Math.random() < 0.2 ? 2 : Math.random() < 0.5 ? 1 : 0;
        const size = layer === 2 ? 40 + Math.random() * 30 : layer === 1 ? 20 + Math.random() * 16 : 10 + Math.random() * 8;
        const p: P = { x: s.w / 2, y: s.h / 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, tx: (Math.random() - 0.5) * 20, ty: (layer === 2 ? 90 : layer === 1 ? 55 : 30) * (0.7 + Math.random() * 0.6), size: isHeart ? size : 6 + Math.random() * 14, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 3, a: 1, spr: Math.floor(Math.random() * 5), age: 1, ph: Math.random() * 6.28, fk: Math.random(), settled: false, life: 1.4 + Math.random() * 1.6, maxLife: 3, kind: isHeart ? 0 : ((1 + Math.floor(Math.random() * 2)) as 1 | 2) };
        if (isHeart) { s.layers[layer].push(p); } else if (s.fx.length < 420) { p.maxLife = p.life; s.fx.push(p); }
      }
    },
  }), []);

  useEffect(() => {
    const c = cv.current; if (!c) return; const ctx = c.getContext("2d"); if (!ctx) return;
    const s = S.current, spr = buildSprites();
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    s.limit = mobile ? 380 : 650; s.dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    const resize = () => { s.w = c.clientWidth; s.h = c.clientHeight; c.width = Math.round(s.w * s.dpr); c.height = Math.round(s.h * s.dpr); };
    resize(); const ro = new ResizeObserver(resize); ro.observe(c);
    let visible = true, hidden = false, raf = 0, last = performance.now(), ema = 0.016, slow = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(c);
    const vis = () => { hidden = document.hidden; last = performance.now(); }; document.addEventListener("visibilitychange", vis);

    const spawn = () => {
      const r = Math.random(), layer = r < 0.45 ? 0 : r < 0.85 ? 1 : 2;
      const size = layer === 2 ? 42 + Math.random() * 28 : layer === 1 ? 20 + Math.random() * 16 : 10 + Math.random() * 9;
      const ty = (layer === 2 ? 95 : layer === 1 ? 58 : 30) * (0.7 + Math.random() * 0.7);
      s.layers[layer].push({ x: Math.random() * (s.w + 80) - 40, y: -size * 1.2, vx: 0, vy: ty, tx: (Math.random() - 0.5) * 24, ty, size, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 1.4, a: layer === 0 ? 0.55 : 0.92, spr: Math.floor(Math.random() * 5), age: 0, ph: Math.random() * 6.28, fk: Math.random(), settled: false, life: 0, maxLife: 0, kind: 0 });
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || hidden) { last = t; return; }
      const raw = Math.min((t - last) / 1000, 0.05); last = t;
      ema = ema * 0.95 + raw * 0.05;
      if (ema > 0.027 && ++slow > 90) { s.limit = Math.max(160, s.limit * 0.8); slow = 0; } else if (ema <= 0.027) slow = 0;
      const dt = raw * s.scale;
      const total = s.layers[0].length + s.layers[1].length + s.layers[2].length;

      if (dt > 0) {
        s.acc += s.rate * dt;
        while (s.acc >= 1) { s.acc -= 1; if (total < s.limit) spawn(); }
        const cx = s.w / 2, cy = s.h * 0.5, rx = Math.min(s.w * 0.44, 480), ry = Math.min(s.h * 0.34, 270);
        const k = 1 - Math.exp(-1.5 * dt);
        for (const L of s.layers) {
          for (let i = L.length - 1; i >= 0; i--) {
            const p = L[i];
            if (p.settled) continue;
            p.age += dt;
            p.vx += (p.tx * s.speed - p.vx) * k; p.vy += (p.ty * s.speed - p.vy) * k;
            p.x += (p.vx + Math.sin(t / 1400 + p.ph) * 14) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
            if (s.reveal) {
              const dx = (p.x - cx) / rx, dy = (p.y - cy) / ry, d2 = dx * dx + dy * dy;
              if (d2 < 1) { const d = Math.sqrt(d2) || 0.01, f = (1 - d) * 260 * dt; p.x += (dx / d) * f; p.y += (dy / d) * f * 0.6; }
            }
            if (s.floor > 0 && s.settled < 380) {
              const stop = s.h - s.floor * s.h * (0.3 + 0.7 * p.fk);
              if (p.y + p.size * 0.4 > stop && p.y < s.h) { p.settled = true; s.settled++; p.vr = 0; }
            }
            if (p.y > s.h + p.size || p.x < -120 || p.x > s.w + 120 || p.y < -s.h) { L[i] = L[L.length - 1]; L.pop(); }
          }
        }
        for (let i = s.fx.length - 1; i >= 0; i--) {
          const p = s.fx[i]; p.life -= dt;
          if (p.life <= 0) { s.fx[i] = s.fx[s.fx.length - 1]; s.fx.pop(); continue; }
          const d = Math.exp(-2.4 * dt); p.vx *= d; p.vy = p.vy * d + 25 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        }
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height);
      const dpr = s.dpr;
      for (let li = 0; li < 3; li++) {
        const ox = Math.sin(t / 5000) * 6 * (li + 1), oy = Math.cos(t / 6500) * 3 * (li + 1);
        const set = li === 2 ? spr.soft : spr.hearts;
        for (const p of s.layers[li]) {
          const a = p.a * Math.min(1, p.age / 0.9 + (p.settled ? 1 : 0));
          ctx.globalAlpha = a;
          const cs = Math.cos(p.rot) * dpr, sn = Math.sin(p.rot) * dpr, h = p.size / 2;
          ctx.setTransform(cs, sn, -sn, cs, (p.x + ox) * dpr, (p.y + oy) * dpr);
          ctx.drawImage(set[p.spr], -h, -h, p.size, p.size);
        }
      }
      ctx.globalCompositeOperation = "lighter";
      for (const p of s.fx) {
        const f = Math.max(0, p.life / p.maxLife); ctx.globalAlpha = f * (p.kind === 2 ? 0.6 + 0.4 * Math.sin(t / 60 + p.ph) : 0.9);
        const cs = Math.cos(p.rot) * dpr, sn = Math.sin(p.rot) * dpr, h = p.size / 2;
        ctx.setTransform(cs, sn, -sn, cs, p.x * dpr, p.y * dpr);
        ctx.drawImage(p.kind === 2 ? spr.fx[2] : spr.fx[p.spr % 2], -h, -h, p.size, p.size);
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);

  return <canvas ref={cv} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
});
export default HeartStormCanvas;
