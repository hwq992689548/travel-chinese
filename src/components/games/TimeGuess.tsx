"use client";

import { useEffect, useRef, useState } from "react";
import { FireworksOverlay } from "./FireworksOverlay";

type Phase = "ready" | "running" | "stopped";

const MIN_SEC = 1;
const ABS_MAX_SEC = 300;
const DEFAULT_MAX = 5;
const MAX_PRESETS = [1, 2, 3, 4, 5, 6, 10, 15, 20];

function formatMs(ms: number) {
  const total = Math.max(0, ms);
  const s = Math.floor(total / 1000);
  const m = total % 1000;
  return `${s}.${String(m).padStart(3, "0")}s`;
}

function clampMax(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_MAX;
  return Math.min(ABS_MAX_SEC, Math.max(MIN_SEC, Math.round(value)));
}

function randomTargetSec(maxSec: number) {
  const max = clampMax(maxSec);
  return MIN_SEC + Math.floor(Math.random() * max);
}

export function TimeGuess() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [maxSec, setMaxSec] = useState(DEFAULT_MAX);
  const [targetSec, setTargetSec] = useState(() =>
    randomTargetSec(DEFAULT_MAX),
  );
  const [elapsed, setElapsed] = useState(0);
  const [resultMs, setResultMs] = useState<number | null>(null);
  const [bestDiff, setBestDiff] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  const [ready, setReady] = useState(false);

  const startRef = useRef(0);
  const rafRef = useRef(0);
  const maxSecRef = useRef(DEFAULT_MAX);

  useEffect(() => {
    const bestRaw = localStorage.getItem("game-timeguess-best");
    if (bestRaw) setBestDiff(Number(bestRaw));

    const maxRaw = localStorage.getItem("game-timeguess-max");
    const nextMax = maxRaw ? clampMax(Number(maxRaw)) : DEFAULT_MAX;
    maxSecRef.current = nextMax;
    setMaxSec(nextMax);
    setTargetSec(randomTargetSec(nextMax));
    setReady(true);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "running") return;
    const tick = (now: number) => {
      setElapsed(now - startRef.current);
      setPulse((p) => p + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  function applyMax(next: number) {
    const clamped = clampMax(next);
    maxSecRef.current = clamped;
    setMaxSec(clamped);
    localStorage.setItem("game-timeguess-max", String(clamped));

    // If currently ready/stopped, refresh target into the new range
    if (phase !== "running") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setPhase("ready");
      setTargetSec(randomTargetSec(clamped));
      setElapsed(0);
      setResultMs(null);
    }
  }

  function newTarget() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("ready");
    setTargetSec(randomTargetSec(maxSecRef.current));
    setElapsed(0);
    setResultMs(null);
  }

  function onMainButton() {
    if (phase === "ready") {
      startRef.current = performance.now();
      setElapsed(0);
      setResultMs(null);
      setPhase("running");
      return;
    }

    if (phase === "running") {
      const ms = performance.now() - startRef.current;
      setElapsed(ms);
      setResultMs(ms);
      setPhase("stopped");

      const targetMs = targetSec * 1000;
      const diff = Math.abs(ms - targetMs);
      setBestDiff((prev) => {
        const next = prev == null ? diff : Math.min(prev, diff);
        localStorage.setItem("game-timeguess-best", String(next));
        return next;
      });
      return;
    }

    newTarget();
  }

  const targetMs = targetSec * 1000;
  const diff = resultMs == null ? null : Math.abs(resultMs - targetMs);
  const early = resultMs != null && resultMs < targetMs;
  // Treat as a hit when within 30ms, or displayed second matches and within 100ms
  const perfect =
    diff != null &&
    (diff < 30 ||
      (Math.round(resultMs! / 1000) === targetSec && diff < 100));

  const displayMs = phase === "running" ? elapsed : (resultMs ?? 0);

  const buttonLabel =
    phase === "ready" ? "START" : phase === "running" ? "STOP" : "AGAIN";

  const buttonTone =
    phase === "ready"
      ? "from-emerald-400 via-teal-500 to-cyan-400 shadow-emerald-500/40"
      : phase === "running"
        ? "from-rose-500 via-orange-500 to-amber-400 shadow-rose-500/45 animate-pulse"
        : perfect
          ? "from-yellow-300 via-amber-400 to-orange-400 shadow-amber-400/50"
          : "from-indigo-400 via-violet-500 to-fuchsia-500 shadow-violet-500/40";

  if (!ready) {
    return <p className="text-[var(--muted)]">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
          Target time
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-5xl text-[var(--ink)] sm:text-6xl">
          {targetSec}
          <span className="ml-2 text-2xl text-[var(--muted)]">sec</span>
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Start the clock, feel the seconds, then stop as close as you can.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[#0b1c24] px-6 py-10 text-center text-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)]">
        <FireworksOverlay active={phase === "stopped" && perfect} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(600px 220px at ${50 + Math.sin(pulse / 12) * 18}% 0%, rgba(34,211,238,0.35), transparent 60%)`,
          }}
        />
        <button
          type="button"
          onClick={newTarget}
          disabled={phase === "running"}
          className="absolute right-3 top-3 z-30 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45 transition hover:bg-white/10 hover:text-white/85 disabled:opacity-30"
        >
          Reset
        </button>
        <p className="relative z-20 text-xs uppercase tracking-[0.2em] text-white/60">
          Elapsed
        </p>
        <p className="relative z-20 mt-2 font-mono text-4xl tabular-nums sm:text-5xl">
          {phase === "ready" ? "0.000s" : formatMs(Math.round(displayMs))}
        </p>

        {diff != null ? (
          <div className="relative z-20 mt-5 space-y-1">
            <p className="text-lg font-semibold">
              {perfect
                ? "Perfect hit — fireworks!"
                : early
                  ? `Early by ${formatMs(Math.round(diff))}`
                  : `Late by ${formatMs(Math.round(diff))}`}
            </p>
            <p className="text-sm text-white/65">
              Target {targetSec}.000s · You {formatMs(Math.round(resultMs!))}
            </p>
          </div>
        ) : (
          <p className="relative z-20 mt-5 text-sm text-white/55">
            {phase === "running"
              ? "No peeking at a wall clock… trust your sense."
              : "Press START when you're ready."}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onMainButton}
          className={`group relative h-36 w-36 rounded-full bg-gradient-to-br ${buttonTone} text-xl font-black tracking-wide text-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)] transition duration-200 hover:scale-[1.04] active:scale-95 sm:h-40 sm:w-40 sm:text-2xl`}
        >
          <span className="absolute inset-2 rounded-full border border-white/30" />
          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition group-hover:opacity-100" />
          <span className="relative drop-shadow">{buttonLabel}</span>
        </button>

        {bestDiff != null ? (
          <p className="text-sm text-[var(--muted)]">
            Best miss:{" "}
            <span className="font-semibold text-[var(--ink)]">
              {formatMs(Math.round(bestDiff))}
            </span>
          </p>
        ) : null}
      </div>

      <div className="mx-auto max-w-md space-y-2 pt-2 text-sm text-[var(--muted)]">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="time-max">Max range · 1–{maxSec}s</label>
          <input
            id="time-max"
            type="number"
            min={MIN_SEC}
            max={ABS_MAX_SEC}
            value={maxSec}
            disabled={phase === "running"}
            onChange={(e) => applyMax(Number(e.target.value))}
            className="w-20 rounded-lg border-0 bg-transparent px-1 py-0.5 text-right font-medium tabular-nums text-[var(--ink)] outline-none ring-0 focus:bg-white/50 disabled:opacity-50"
          />
        </div>
        <input
          type="range"
          min={MIN_SEC}
          max={ABS_MAX_SEC}
          value={maxSec}
          disabled={phase === "running"}
          onChange={(e) => applyMax(Number(e.target.value))}
          className="w-full accent-[var(--accent)] disabled:opacity-50"
        />
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {MAX_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={phase === "running"}
              onClick={() => applyMax(preset)}
              className={`text-xs transition disabled:opacity-50 ${
                maxSec === preset
                  ? "font-semibold text-[var(--accent)]"
                  : "hover:text-[var(--ink)]"
              }`}
            >
              {preset}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
