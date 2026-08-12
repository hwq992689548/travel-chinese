"use client";

import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

type Burst = {
  x: number;
  y: number;
  age: number;
  sparks: Spark[];
};

const COLORS = [
  "#ffd166",
  "#ef476f",
  "#06d6a0",
  "#118ab2",
  "#f72585",
  "#fee440",
  "#4cc9f0",
  "#ffffff",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeBurst(w: number, h: number): Burst {
  const x = rand(w * 0.15, w * 0.85);
  const y = rand(h * 0.15, h * 0.55);
  const sparks: Spark[] = [];
  const count = 28 + Math.floor(Math.random() * 18);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 * i) / count + rand(-0.2, 0.2);
    const sp = rand(1.5, 5.5);
    sparks.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: rand(0.55, 1.15),
      color: Math.random() < 0.35 ? COLORS[Math.floor(Math.random() * COLORS.length)] : color,
      size: rand(1.5, 3.2),
    });
  }
  return { x, y, age: 0, sparks };
}

type Props = {
  active: boolean;
};

export function FireworksOverlay({ active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parentEl = canvas.parentElement;
    if (!parentEl) return;
    const host = parentEl;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const surface = canvas;
    const draw = ctx;
    let raf = 0;
    let last = performance.now();
    let spawnAcc = 0;
    const bursts: Burst[] = [];

    function resize() {
      const w = host.clientWidth;
      const h = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.floor(w * dpr);
      surface.height = Math.floor(h * dpr);
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      draw.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    }

    let { w, h } = resize();
    bursts.push(makeBurst(w, h), makeBurst(w, h));

    function tick(now: number) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      spawnAcc += dt;

      if (spawnAcc > 0.28 && bursts.length < 8) {
        spawnAcc = 0;
        ({ w, h } = { w: host.clientWidth, h: host.clientHeight });
        bursts.push(makeBurst(w, h));
      }

      draw.clearRect(0, 0, w, h);

      for (const burst of bursts) {
        burst.age += dt;
        for (const s of burst.sparks) {
          s.life -= dt;
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 6 * dt;
          s.vx *= 0.99;
          if (s.life <= 0) continue;
          draw.globalAlpha = Math.max(0, Math.min(1, s.life));
          draw.fillStyle = s.color;
          draw.beginPath();
          draw.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          draw.fill();
        }
      }
      draw.globalAlpha = 1;

      for (let i = bursts.length - 1; i >= 0; i--) {
        if (bursts[i].sparks.every((s) => s.life <= 0)) bursts.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    const onResize = () => {
      ({ w, h } = resize());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
}
