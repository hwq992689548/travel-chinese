"use client";

import { useMemo, useState } from "react";

const STAMPS = [
  { emoji: "✈️", label: "Flight", color: "#4cc9f0" },
  { emoji: "🎫", label: "Ticket", color: "#f72585" },
  { emoji: "📷", label: "Camera", color: "#7209b7" },
  { emoji: "🗺️", label: "Map", color: "#2a9d8f" },
  { emoji: "🎒", label: "Bag", color: "#e76f51" },
  { emoji: "🧭", label: "Compass", color: "#e9c46a" },
  { emoji: "🧳", label: "Luggage", color: "#457b9d" },
  { emoji: "🏯", label: "Temple", color: "#c1121f" },
];

function pickStamp(exclude?: string) {
  const pool = STAMPS.filter((s) => s.emoji !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function StampPeel() {
  const [stamp, setStamp] = useState(() => pickStamp());
  const [peel, setPeel] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("game-peel-best") || 0);
  });
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const curl = useMemo(() => Math.min(1, peel), [peel]);

  function finishPeel() {
    const nextScore = score + 1;
    setScore(nextScore);
    setBest((prev) => {
      const n = Math.max(prev, nextScore);
      localStorage.setItem("game-peel-best", String(n));
      return n;
    });
    setPeel(0);
    setStamp(pickStamp(stamp.emoji));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setStartY(e.clientY);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const dy = startY - e.clientY;
    const next = Math.max(0, Math.min(1, dy / 140));
    setPeel(next);
    if (next >= 0.98) {
      setDragging(false);
      finishPeel();
    }
  }

  function onPointerUp() {
    setDragging(false);
    if (peel < 0.98) {
      // soft spring back
      setPeel(0);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-[var(--muted)]">
          Peeled: <span className="font-semibold text-[var(--ink)]">{score}</span>
          {best > 0 ? ` · Best: ${best}` : ""}
        </p>
        <p className="text-[var(--muted)]">Drag upward to peel</p>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[linear-gradient(160deg,#f7f3eb,#e7eef0)] px-6 py-10">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-6">
          <div
            className="relative h-56 w-56 touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* adhesive shadow left on paper */}
            <div
              className="absolute inset-6 rounded-3xl border border-dashed border-[var(--line)] bg-white/40"
              style={{ opacity: 0.35 + curl * 0.4 }}
            />

            <div
              className="absolute inset-4 cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateY(${-curl * 70}px) rotate(${-curl * 12}deg)`,
                transformOrigin: "top center",
                transition: dragging ? "none" : "transform 280ms ease",
              }}
            >
              <div
                className="flex h-full w-full flex-col items-center justify-center rounded-[1.6rem] border-2 border-white/70 shadow-[0_18px_40px_-20px_rgba(20,40,50,0.45)]"
                style={{
                  background: `linear-gradient(145deg, ${stamp.color}dd, ${stamp.color}99)`,
                  clipPath: `inset(0 0 ${curl * 35}% 0 round 1.4rem)`,
                }}
              >
                <div className="text-6xl drop-shadow">{stamp.emoji}</div>
                <p className="mt-2 text-sm font-semibold tracking-wide text-white/95">
                  {stamp.label}
                </p>
              </div>
              {/* curled edge hint */}
              <div
                className="pointer-events-none absolute inset-x-8 bottom-2 h-3 rounded-full bg-black/10"
                style={{ opacity: curl * 0.7, transform: `scaleX(${0.7 + curl * 0.3})` }}
              />
            </div>
          </div>

          <div className="w-full max-w-xs">
            <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
              <span>Peel</span>
              <span>{Math.round(curl * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width]"
                style={{ width: `${curl * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-[var(--muted)]">
        Press and drag up to peel travel stickers. No fail state — peel as many as
        you like.
      </p>
    </div>
  );
}
