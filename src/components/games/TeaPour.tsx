"use client";

import { useEffect, useRef, useState } from "react";
import { FireworksOverlay } from "./FireworksOverlay";

type Result = "none" | "low" | "good" | "perfect" | "spill";

function randTarget() {
  return 0.62 + Math.random() * 0.2;
}

export function TeaPour() {
  const [level, setLevel] = useState(0.08);
  const [pouring, setPouring] = useState(false);
  const [target, setTarget] = useState(() => randTarget());
  const [result, setResult] = useState<Result>("none");
  const [round, setRound] = useState(1);
  const [perfects, setPerfects] = useState(0);
  const [best, setBest] = useState(0);

  const levelRef = useRef(0.08);
  const pouringRef = useRef(false);
  const resultRef = useRef<Result>("none");
  const targetRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const raw = localStorage.getItem("game-tea-best");
    if (raw) setBest(Number(raw));
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    const loop = (now: number) => {
      if (pouringRef.current && resultRef.current === "none") {
        const rate = 0.22 + Math.sin(now / 180) * 0.02;
        const next = Math.min(1.08, levelRef.current + rate * 0.016);
        levelRef.current = next;
        setLevel(next);
        if (next >= 1.02) {
          pouringRef.current = false;
          setPouring(false);
          resultRef.current = "spill";
          setResult("spill");
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function startPour() {
    if (resultRef.current !== "none") return;
    pouringRef.current = true;
    setPouring(true);
  }

  function stopPour() {
    if (!pouringRef.current) return;
    pouringRef.current = false;
    setPouring(false);
    judge(levelRef.current);
  }

  function judge(fill: number) {
    const t = targetRef.current;
    const diff = Math.abs(fill - t);
    let r: Result = "low";
    if (fill > 0.98) r = "spill";
    else if (diff <= 0.03) r = "perfect";
    else if (diff <= 0.08) r = "good";
    else if (fill < t) r = "low";
    else r = "spill";

    resultRef.current = r;
    setResult(r);

    if (r === "perfect") {
      setPerfects((p) => {
        const n = p + 1;
        setBest((b) => {
          const nb = Math.max(b, n);
          localStorage.setItem("game-tea-best", String(nb));
          return nb;
        });
        return n;
      });
    }
  }

  function again() {
    levelRef.current = 0.08;
    resultRef.current = "none";
    pouringRef.current = false;
    const t = randTarget();
    targetRef.current = t;
    setTarget(t);
    setLevel(0.08);
    setResult("none");
    setPouring(false);
    setRound((r) => r + 1);
  }

  const bandTop = (1 - (target + 0.04)) * 100;
  const bandHeight = 8;
  const fillPct = Math.min(100, level * 100);
  const potTilt = pouring ? -28 : -8;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-[var(--muted)]">
          Round {round} · Perfects:{" "}
          <span className="font-semibold text-[var(--ink)]">{perfects}</span>
          {best > 0 ? ` · Best: ${best}` : ""}
        </p>
        <button
          type="button"
          onClick={again}
          className="rounded-full border border-[var(--line)] px-4 py-1.5 font-medium hover:border-[var(--accent)]"
        >
          New pour
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[linear-gradient(180deg,#f7f3eb,#ebe4d8)] px-4 py-8">
        <FireworksOverlay active={result === "perfect"} />

        <div className="relative z-10 mx-auto flex max-w-md items-end justify-center gap-8 pt-4">
          <button
            type="button"
            onPointerDown={startPour}
            onPointerUp={stopPour}
            onPointerLeave={stopPour}
            onPointerCancel={stopPour}
            disabled={result !== "none"}
            className="relative mb-10 select-none disabled:opacity-50"
            style={{
              transform: `rotate(${potTilt}deg)`,
              transition: pouring ? "transform 120ms ease" : "transform 280ms ease",
            }}
            aria-label="Hold to pour tea"
          >
            <div className="text-7xl drop-shadow-sm">🫖</div>
            <p className="mt-2 text-center text-xs font-medium text-[var(--muted)]">
              Hold to pour
            </p>
          </button>

          <div className="relative h-52 w-36">
            <div
              className="pointer-events-none absolute inset-x-2 z-20 rounded-sm border border-[var(--accent)]/50 bg-[var(--accent)]/15"
              style={{ top: `${bandTop}%`, height: `${bandHeight}%` }}
            />
            <div className="absolute inset-x-0 bottom-0 top-4 overflow-hidden rounded-b-[2rem] rounded-t-lg border-[3px] border-[#c4b5a0] bg-[#fffaf1]/80">
              <div
                className="absolute inset-x-0 bottom-0 transition-[height] duration-75"
                style={{
                  height: `${fillPct}%`,
                  background:
                    "linear-gradient(180deg, rgba(120,72,40,0.75), rgba(78,42,20,0.92))",
                }}
              />
              <div className="pointer-events-none absolute inset-y-0 left-2 w-3 bg-white/20" />
            </div>
            <div className="absolute -right-3 top-16 h-20 w-4 rounded-full border-[3px] border-[#c4b5a0] bg-transparent" />
          </div>
        </div>

        <div className="relative z-10 mt-6 text-center text-sm">
          {result === "none" ? (
            <p className="text-[var(--muted)]">
              Fill into the green band. Release to stop.
            </p>
          ) : result === "perfect" ? (
            <p className="font-semibold text-[var(--accent)]">
              Perfect pour — fireworks!
            </p>
          ) : result === "good" ? (
            <p className="font-semibold text-[var(--ink)]">
              Good pour. Try for perfect.
            </p>
          ) : result === "low" ? (
            <p className="font-semibold text-[var(--ink)]">A bit low. New pour?</p>
          ) : (
            <p className="font-semibold text-[var(--accent-2)]">
              Spill! Wipe and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
