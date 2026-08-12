"use client";

import { useEffect, useRef, useState } from "react";

type Flyer = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  emoji: string;
  rot: number;
  spin: number;
  alive: boolean;
  hazard: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  w: number;
  h: number;
};

/** Travel stickers / stamps — deliberately not fruit-arcade. */
const STAMP_SET = [
  { emoji: "✈️", color: "#4cc9f0", hazard: false },
  { emoji: "🎫", color: "#f72585", hazard: false },
  { emoji: "📷", color: "#7209b7", hazard: false },
  { emoji: "🗺️", color: "#2a9d8f", hazard: false },
  { emoji: "🎒", color: "#e76f51", hazard: false },
  { emoji: "🧭", color: "#e9c46a", hazard: false },
  { emoji: "🧳", color: "#457b9d", hazard: false },
  { emoji: "🗽", color: "#06d6a0", hazard: false },
  { emoji: "🏯", color: "#c1121f", hazard: false },
  { emoji: "🚫", color: "#212529", hazard: true },
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function SliceRush() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const stateRef = useRef({
    flyers: [] as Flyer[],
    particles: [] as Particle[],
    slash: [] as { x: number; y: number; t: number }[],
    score: 0,
    lives: 3,
    running: false,
    gameOver: false,
    spawnAcc: 0,
    id: 1,
    pointerDown: false,
    lastX: 0,
    lastY: 0,
    width: 0,
    height: 0,
    dpr: 1,
  });

  useEffect(() => {
    const raw = localStorage.getItem("game-stamp-best");
    if (raw) setBest(Number(raw));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const surface = canvas;
    const draw = ctx;

    const state = stateRef.current;
    let raf = 0;
    let last = performance.now();

    function resize() {
      const parent = surface.parentElement;
      const w = parent?.clientWidth || 640;
      const h = Math.min(520, Math.max(360, Math.round(w * 0.72)));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.floor(w * dpr);
      surface.height = Math.floor(h * dpr);
      surface.style.width = `${w}px`;
      surface.style.height = `${h}px`;
      state.width = w;
      state.height = h;
      state.dpr = dpr;
      draw.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    function spawnFlyer() {
      // Bias away from hazards a bit
      const pool =
        Math.random() < 0.16
          ? STAMP_SET.filter((s) => s.hazard)
          : STAMP_SET.filter((s) => !s.hazard);
      const kind = pool[Math.floor(Math.random() * pool.length)];
      const fromLeft = Math.random() < 0.5;
      const x = fromLeft ? rand(-20, 40) : rand(state.width - 40, state.width + 20);
      const y = state.height + 30;
      state.flyers.push({
        id: state.id++,
        x,
        y,
        vx: fromLeft ? rand(2.2, 4.2) : -rand(2.2, 4.2),
        vy: -rand(11, 15.5),
        r: rand(24, 32),
        emoji: kind.emoji,
        rot: rand(-0.4, 0.4),
        spin: rand(-1.8, 1.8),
        alive: true,
        hazard: kind.hazard,
      });
    }

    function sliceAt(x: number, y: number, prevX: number, prevY: number) {
      const dx = x - prevX;
      const dy = y - prevY;
      if (dx * dx + dy * dy < 16) return;

      state.slash.push({ x, y, t: 1 });

      for (const flyer of state.flyers) {
        if (!flyer.alive) continue;
        const fx = flyer.x;
        const fy = flyer.y;
        const segLen2 = dx * dx + dy * dy || 1;
        let t = ((fx - prevX) * dx + (fy - prevY) * dy) / segLen2;
        t = Math.max(0, Math.min(1, t));
        const cx = prevX + t * dx;
        const cy = prevY + t * dy;
        const dist = Math.hypot(fx - cx, fy - cy);
        if (dist > flyer.r + 8) continue;

        flyer.alive = false;
        if (flyer.hazard) {
          state.lives -= 1;
          setLives(state.lives);
          burst(flyer.x, flyer.y, "#212529");
          if (state.lives <= 0) endGame();
        } else {
          state.score += 1;
          setScore(state.score);
          const color =
            STAMP_SET.find((f) => f.emoji === flyer.emoji)?.color || "#4cc9f0";
          burst(flyer.x, flyer.y, color);
        }
      }
    }

    function burst(x: number, y: number, color: string) {
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rand(2, 7);
        state.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: rand(0.45, 0.95),
          color,
          w: rand(3, 8),
          h: rand(6, 14),
        });
      }
    }

    function endGame() {
      state.running = false;
      state.gameOver = true;
      setRunning(false);
      setGameOver(true);
      setBest((prev) => {
        const next = Math.max(prev, state.score);
        localStorage.setItem("game-stamp-best", String(next));
        return next;
      });
    }

    function drawSky() {
      const g = draw.createLinearGradient(0, 0, 0, state.height);
      g.addColorStop(0, "#caf0f8");
      g.addColorStop(0.55, "#90e0ef");
      g.addColorStop(1, "#48cae4");
      draw.fillStyle = g;
      draw.fillRect(0, 0, state.width, state.height);

      // soft cloud blobs
      draw.fillStyle = "rgba(255,255,255,0.55)";
      const clouds = [
        [state.width * 0.15, state.height * 0.18, 48],
        [state.width * 0.55, state.height * 0.12, 36],
        [state.width * 0.82, state.height * 0.22, 42],
      ] as const;
      for (const [cx, cy, r] of clouds) {
        draw.beginPath();
        draw.arc(cx, cy, r, 0, Math.PI * 2);
        draw.arc(cx + r * 0.7, cy + 6, r * 0.75, 0, Math.PI * 2);
        draw.arc(cx - r * 0.65, cy + 8, r * 0.7, 0, Math.PI * 2);
        draw.fill();
      }
    }

    function tick(now: number) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      draw.clearRect(0, 0, state.width, state.height);
      drawSky();

      if (state.running) {
        state.spawnAcc += dt;
        const interval = Math.max(0.55, 1.05 - state.score * 0.02);
        if (state.spawnAcc >= interval) {
          state.spawnAcc = 0;
          spawnFlyer();
          if (Math.random() < 0.35) spawnFlyer();
        }

        const gravity = 22;
        for (const flyer of state.flyers) {
          if (!flyer.alive) continue;
          flyer.vy += gravity * dt;
          flyer.x += flyer.vx * 60 * dt;
          flyer.y += flyer.vy * 60 * dt;
          flyer.rot += flyer.spin * dt;

          if (flyer.y > state.height + 60 && flyer.alive) {
            flyer.alive = false;
            if (!flyer.hazard) {
              state.lives -= 1;
              setLives(state.lives);
              if (state.lives <= 0) endGame();
            }
          }
        }
        state.flyers = state.flyers.filter((f) => f.alive);
      }

      for (const p of state.particles) {
        p.life -= dt;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
      }
      state.particles = state.particles.filter((p) => p.life > 0);

      // paper confetti scraps (not fruit juice droplets)
      for (const p of state.particles) {
        draw.save();
        draw.globalAlpha = Math.max(0, p.life);
        draw.translate(p.x, p.y);
        draw.rotate(p.life * 6);
        draw.fillStyle = p.color;
        draw.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        draw.restore();
      }
      draw.globalAlpha = 1;

      for (const flyer of state.flyers) {
        if (!flyer.alive) continue;
        draw.save();
        draw.translate(flyer.x, flyer.y);
        draw.rotate(flyer.rot);

        // stamp / sticker plate behind the icon
        draw.beginPath();
        draw.arc(0, 0, flyer.r + 4, 0, Math.PI * 2);
        draw.fillStyle = flyer.hazard
          ? "rgba(33,37,41,0.92)"
          : "rgba(255,250,241,0.95)";
        draw.fill();
        draw.lineWidth = 2;
        draw.strokeStyle = flyer.hazard
          ? "rgba(255,255,255,0.35)"
          : "rgba(28,42,48,0.18)";
        draw.setLineDash(flyer.hazard ? [] : [3, 3]);
        draw.stroke();
        draw.setLineDash([]);

        draw.font = `${flyer.r * 1.55}px serif`;
        draw.textAlign = "center";
        draw.textBaseline = "middle";
        draw.fillText(flyer.emoji, 0, 1);
        draw.restore();
      }

      if (state.slash.length > 1) {
        draw.strokeStyle = "rgba(15,107,92,0.9)";
        draw.lineWidth = 3.5;
        draw.lineCap = "round";
        draw.shadowColor = "rgba(15,107,92,0.35)";
        draw.shadowBlur = 8;
        draw.beginPath();
        state.slash.forEach((p, i) => {
          if (i === 0) draw.moveTo(p.x, p.y);
          else draw.lineTo(p.x, p.y);
        });
        draw.stroke();
        draw.shadowBlur = 0;
      }
      state.slash = state.slash
        .map((p) => ({ ...p, t: p.t - dt * 4 }))
        .filter((p) => p.t > 0);

      if (!state.running) {
        draw.fillStyle = "rgba(28,42,48,0.28)";
        draw.fillRect(0, 0, state.width, state.height);
        draw.fillStyle = "#1c2a30";
        draw.font = "700 28px DM Sans, sans-serif";
        draw.textAlign = "center";
        draw.fillText(
          state.gameOver ? "Trip over — tap Start" : "Stamp Slash",
          state.width / 2,
          state.height / 2 - 12,
        );
        draw.font = "500 16px DM Sans, sans-serif";
        draw.fillStyle = "rgba(28,42,48,0.8)";
        draw.fillText(
          "Swipe travel stamps. Avoid 🚫 marks.",
          state.width / 2,
          state.height / 2 + 22,
        );
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    function pos(e: PointerEvent) {
      const rect = surface.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function onDown(e: PointerEvent) {
      surface.setPointerCapture(e.pointerId);
      const p = pos(e);
      state.pointerDown = true;
      state.lastX = p.x;
      state.lastY = p.y;
      state.slash = [{ x: p.x, y: p.y, t: 1 }];
    }

    function onMove(e: PointerEvent) {
      if (!state.pointerDown || !state.running) return;
      const p = pos(e);
      sliceAt(p.x, p.y, state.lastX, state.lastY);
      state.lastX = p.x;
      state.lastY = p.y;
      state.slash.push({ x: p.x, y: p.y, t: 1 });
      if (state.slash.length > 12) state.slash.shift();
    }

    function onUp() {
      state.pointerDown = false;
      state.slash = [];
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

  function start() {
    const state = stateRef.current;
    state.flyers = [];
    state.particles = [];
    state.slash = [];
    state.score = 0;
    state.lives = 3;
    state.spawnAcc = 0;
    state.running = true;
    state.gameOver = false;
    setScore(0);
    setLives(3);
    setRunning(true);
    setGameOver(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-[var(--muted)]">
          Score: <span className="font-semibold text-[var(--ink)]">{score}</span>
          {" · "}
          Lives: <span className="font-semibold text-[var(--ink)]">{lives}</span>
          {best > 0 ? ` · Best: ${best}` : ""}
        </p>
        <button
          type="button"
          onClick={start}
          className="rounded-full bg-[var(--accent)] px-4 py-1.5 font-semibold text-white hover:brightness-110"
        >
          {running ? "Restart" : gameOver ? "Play again" : "Start"}
        </button>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] shadow-[0_24px_60px_-36px_rgba(18,40,48,0.55)] touch-none">
        <canvas ref={canvasRef} className="block w-full select-none" />
      </div>

      <p className="text-sm text-[var(--muted)]">
        Swipe to collect flying travel stamps (plane, ticket, map…). Miss three
        and the trip ends. Slash a 🚫 mark and you lose a life.
      </p>
    </div>
  );
}
