"use client";

import { useEffect, useRef, useState } from "react";

type Bubble = {
  id: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
  alive: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function BubbleSoft() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const stateRef = useRef({
    bubbles: [] as Bubble[],
    particles: [] as Particle[],
    score: 0,
    id: 1,
    spawnAcc: 0,
    width: 0,
    height: 0,
    pointerDown: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    const raw = localStorage.getItem("game-bubbles-best");
    if (raw) setBest(Number(raw));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parentEl = canvas.parentElement;
    if (!parentEl) return;
    const host = parentEl;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const surface = canvas;
    const draw = ctx;
    const state = stateRef.current;
    let raf = 0;
    let last = performance.now();

    function resize() {
      const w = host.clientWidth;
      const h = Math.min(480, Math.max(340, Math.round(w * 0.7)));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.floor(w * dpr);
      surface.height = Math.floor(h * dpr);
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      state.width = w;
      state.height = h;
      draw.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    function spawn() {
      state.bubbles.push({
        id: state.id++,
        x: rand(30, state.width - 30),
        y: state.height + rand(10, 40),
        r: rand(16, 42),
        vx: rand(-0.35, 0.35),
        vy: -rand(0.35, 0.9),
        hue: rand(170, 210),
        alive: true,
      });
    }

    function burst(x: number, y: number, hue: number, r: number) {
      const n = 8 + Math.floor(r / 6);
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(0.6, 2.4);
        state.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: rand(0.35, 0.7),
          hue,
        });
      }
    }

    function popAt(x: number, y: number) {
      for (const b of state.bubbles) {
        if (!b.alive) continue;
        if (Math.hypot(b.x - x, b.y - y) <= b.r + 6) {
          b.alive = false;
          burst(b.x, b.y, b.hue, b.r);
          state.score += 1;
          setScore(state.score);
          setBest((prev) => {
            const next = Math.max(prev, state.score);
            localStorage.setItem("game-bubbles-best", String(next));
            return next;
          });
        }
      }
    }

    function tick(now: number) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      state.spawnAcc += dt;
      if (state.spawnAcc > 0.45) {
        state.spawnAcc = 0;
        spawn();
        if (Math.random() < 0.35) spawn();
      }

      draw.clearRect(0, 0, state.width, state.height);
      const g = draw.createLinearGradient(0, 0, 0, state.height);
      g.addColorStop(0, "#e8f6f8");
      g.addColorStop(1, "#cfe8ea");
      draw.fillStyle = g;
      draw.fillRect(0, 0, state.width, state.height);

      for (const b of state.bubbles) {
        if (!b.alive) continue;
        b.x += b.vx * 60 * dt;
        b.y += b.vy * 60 * dt;
        b.x += Math.sin(now / 400 + b.id) * 0.15;
        if (b.y + b.r < -20) b.alive = false;

        draw.beginPath();
        draw.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        draw.fillStyle = `hsla(${b.hue}, 55%, 70%, 0.28)`;
        draw.fill();
        draw.strokeStyle = `hsla(${b.hue}, 45%, 55%, 0.55)`;
        draw.lineWidth = 2;
        draw.stroke();
        draw.beginPath();
        draw.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.18, 0, Math.PI * 2);
        draw.fillStyle = "rgba(255,255,255,0.55)";
        draw.fill();
      }
      state.bubbles = state.bubbles.filter((b) => b.alive);

      for (const p of state.particles) {
        p.life -= dt;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
      }
      state.particles = state.particles.filter((p) => p.life > 0);
      for (const p of state.particles) {
        draw.globalAlpha = Math.max(0, p.life);
        draw.fillStyle = `hsl(${p.hue}, 60%, 65%)`;
        draw.beginPath();
        draw.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        draw.fill();
      }
      draw.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    function pos(e: PointerEvent) {
      const rect = surface.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onDown(e: PointerEvent) {
      surface.setPointerCapture(e.pointerId);
      const p = pos(e);
      state.pointerDown = true;
      state.lastX = p.x;
      state.lastY = p.y;
      popAt(p.x, p.y);
    }
    function onMove(e: PointerEvent) {
      if (!state.pointerDown) return;
      const p = pos(e);
      popAt(p.x, p.y);
      state.lastX = p.x;
      state.lastY = p.y;
    }
    function onUp() {
      state.pointerDown = false;
    }

    surface.addEventListener("pointerdown", onDown);
    surface.addEventListener("pointermove", onMove);
    surface.addEventListener("pointerup", onUp);
    surface.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      surface.removeEventListener("pointerdown", onDown);
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerup", onUp);
      surface.removeEventListener("pointercancel", onUp);
    };
  }, []);

  function resetScore() {
    stateRef.current.score = 0;
    setScore(0);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-[var(--muted)]">
          Popped: <span className="font-semibold text-[var(--ink)]">{score}</span>
          {best > 0 ? ` · Best: ${best}` : ""}
        </p>
        <button
          type="button"
          onClick={resetScore}
          className="rounded-full border border-[var(--line)] px-4 py-1.5 font-medium hover:border-[var(--accent)]"
        >
          Reset score
        </button>
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] touch-none">
        <canvas ref={canvasRef} className="block w-full select-none" />
      </div>
      <p className="text-sm text-[var(--muted)]">
        Tap or swipe through soft bubbles. No timer, no fail — just pop.
      </p>
    </div>
  );
}
