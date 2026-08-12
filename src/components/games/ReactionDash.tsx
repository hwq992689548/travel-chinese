"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "wait" | "go" | "early" | "result";

export function ReactionDash() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const startRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("game-reaction-best");
    if (raw) setBest(Number(raw));
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function start() {
    clearTimer();
    setMs(null);
    setPhase("wait");
    const delay = 1200 + Math.random() * 2800;
    timerRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
    }, delay);
  }

  function tap() {
    if (phase === "idle" || phase === "result" || phase === "early") {
      start();
      return;
    }
    if (phase === "wait") {
      clearTimer();
      setPhase("early");
      return;
    }
    if (phase === "go") {
      const score = Math.round(performance.now() - startRef.current);
      setMs(score);
      setPhase("result");
      setBest((prev) => {
        const next = prev == null ? score : Math.min(prev, score);
        localStorage.setItem("game-reaction-best", String(next));
        return next;
      });
    }
  }

  const label =
    phase === "idle"
      ? "Tap to start"
      : phase === "wait"
        ? "Wait for green…"
        : phase === "go"
          ? "TAP!"
          : phase === "early"
            ? "Too soon — tap to retry"
            : `${ms} ms — tap to retry`;

  const bg =
    phase === "go"
      ? "bg-[var(--accent)] text-white"
      : phase === "early"
        ? "bg-[var(--accent-2)] text-white"
        : phase === "wait"
          ? "bg-[#c45c26]/20 text-[var(--ink)]"
          : "bg-[var(--paper-elevated)] text-[var(--ink)]";

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={tap}
        className={`flex min-h-[320px] w-full flex-col items-center justify-center rounded-[1.75rem] border border-[var(--line)] px-6 text-center shadow-[0_24px_60px_-36px_rgba(18,40,48,0.45)] transition ${bg}`}
      >
        <span className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
          {label}
        </span>
        {phase === "result" && best != null ? (
          <span className="mt-3 text-sm opacity-90">Best: {best} ms</span>
        ) : null}
      </button>
      <p className="text-sm text-[var(--muted)]">
        Wait until the panel turns green, then tap as fast as you can. Don&apos;t
        jump the gun.
      </p>
    </div>
  );
}
