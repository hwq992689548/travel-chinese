"use client";

import { useEffect, useRef, useState } from "react";
import { FireworksOverlay } from "./FireworksOverlay";

type Phase = "idle" | "playing" | "ended";
type Hit = "none" | "miss" | "good" | "perfect";

const ROUND_MS = 10_000;
const PERFECT_MIN = 0.58;
const PERFECT_MAX = 0.72;
const GOOD_PAD = 0.1;
const CHARGE_RATE = 0.55; // per second toward full

function judgePower(p: number): Hit {
  if (p >= PERFECT_MIN && p <= PERFECT_MAX) return "perfect";
  if (p >= PERFECT_MIN - GOOD_PAD && p <= PERFECT_MAX + GOOD_PAD) return "good";
  return "miss";
}

function hitPoints(hit: Hit, combo: number): number {
  if (hit === "perfect") return Math.round(100 * (1 + combo * 0.1));
  if (hit === "good") return 50;
  if (hit === "miss") return 10;
  return 0;
}

export function SlapChallenge() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [power, setPower] = useState(0);
  const [charging, setCharging] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [remainingMs, setRemainingMs] = useState(ROUND_MS);
  const [hit, setHit] = useState<Hit>("none");
  const [slapFlash, setSlapFlash] = useState(false);
  const [faceTilt, setFaceTilt] = useState(0);
  const [popup, setPopup] = useState<string | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const phaseRef = useRef<Phase>("idle");
  const chargingRef = useRef(false);
  const powerRef = useRef(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const bestRef = useRef(0);
  const endAtRef = useRef(0);
  const rafRef = useRef(0);
  const flashTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("game-slap-best");
    if (raw) {
      const n = Number(raw);
      bestRef.current = n;
      setBest(n);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const loop = (now: number) => {
      if (phaseRef.current === "playing") {
        const left = Math.max(0, endAtRef.current - now);
        setRemainingMs(left);
        if (left <= 0) {
          finishRound();
        } else if (chargingRef.current) {
          const next = Math.min(1, powerRef.current + CHARGE_RATE * 0.016);
          powerRef.current = next;
          setPower(next);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finishRound() {
    if (phaseRef.current !== "playing") return;
    chargingRef.current = false;
    setCharging(false);
    phaseRef.current = "ended";
    setPhase("ended");
    setRemainingMs(0);
    const finalScore = scoreRef.current;
    const beat = finalScore > bestRef.current;
    setIsNewBest(beat);
    if (beat) {
      bestRef.current = finalScore;
      setBest(finalScore);
      localStorage.setItem("game-slap-best", String(finalScore));
    }
  }

  function startRound() {
    if (flashTimerRef.current) {
      window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }
    scoreRef.current = 0;
    comboRef.current = 0;
    maxComboRef.current = 0;
    powerRef.current = 0;
    chargingRef.current = false;
    phaseRef.current = "playing";
    endAtRef.current = performance.now() + ROUND_MS;
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPower(0);
    setCharging(false);
    setHit("none");
    setSlapFlash(false);
    setFaceTilt(0);
    setPopup(null);
    setIsNewBest(false);
    setRemainingMs(ROUND_MS);
    setPhase("playing");
  }

  function startCharge(e: React.PointerEvent) {
    if (phaseRef.current !== "playing") return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    powerRef.current = 0;
    setPower(0);
    setHit("none");
    setPopup(null);
    chargingRef.current = true;
    setCharging(true);
  }

  function releaseCharge() {
    if (phaseRef.current !== "playing" || !chargingRef.current) return;
    chargingRef.current = false;
    setCharging(false);

    const p = powerRef.current;
    const result = judgePower(p);
    const nextCombo = result === "perfect" ? comboRef.current + 1 : 0;
    const gained = hitPoints(result, comboRef.current);
    const nextScore = scoreRef.current + gained;
    const nextMax =
      result === "perfect"
        ? Math.max(maxComboRef.current, nextCombo)
        : maxComboRef.current;

    scoreRef.current = nextScore;
    comboRef.current = nextCombo;
    maxComboRef.current = nextMax;
    setScore(nextScore);
    setCombo(nextCombo);
    setMaxCombo(nextMax);
    setHit(result);
    setSlapFlash(true);
    setFaceTilt(result === "miss" ? -6 : result === "good" ? -14 : -22);
    setPopup(
      result === "perfect"
        ? `啪！Perfect +${gained}`
        : result === "good"
          ? `啪 Good +${gained}`
          : `啪 +${gained}`,
    );

    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => {
      setSlapFlash(false);
      setFaceTilt(0);
      setPopup(null);
      powerRef.current = 0;
      setPower(0);
      setHit("none");
    }, 420);
  }

  const secondsLeft = (remainingMs / 1000).toFixed(1);
  const powerPct = Math.min(100, power * 100);
  const bandTop = (1 - PERFECT_MAX) * 100;
  const bandHeight = (PERFECT_MAX - PERFECT_MIN) * 100;

  const faceMood =
    hit === "perfect"
      ? "😵"
      : hit === "good"
        ? "😮"
        : hit === "miss"
          ? "😐"
          : charging
            ? "😳"
            : "🙂";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-[var(--muted)]">
          Score:{" "}
          <span className="font-semibold text-[var(--ink)]">{score}</span>
          {" · "}
          Combo:{" "}
          <span className="font-semibold text-[var(--ink)]">{combo}</span>
          {best > 0 ? (
            <>
              {" · "}
              Best: <span className="font-semibold text-[var(--ink)]">{best}</span>
            </>
          ) : null}
        </p>
        <p className="font-mono tabular-nums text-[var(--ink)]">
          {phase === "playing" ? `${secondsLeft}s` : phase === "ended" ? "0.0s" : "10.0s"}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[linear-gradient(165deg,#f3efe6_0%,#e7dfd0_45%,#d9cfc0_100%)] px-4 py-8">
        <FireworksOverlay active={hit === "perfect"} />

        {phase === "ended" ? (
          <div className="relative z-20 mx-auto flex max-w-md flex-col items-center gap-4 py-10 text-center">
            <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
              Time&apos;s up
            </p>
            <p className="text-[var(--muted)]">
              Score{" "}
              <span className="font-semibold text-[var(--ink)]">{score}</span>
              {" · "}
              Max combo{" "}
              <span className="font-semibold text-[var(--ink)]">{maxCombo}</span>
              {isNewBest ? " · New best!" : ""}
            </p>
            <button
              type="button"
              onClick={startRound}
              className="rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] px-6 py-2.5 font-medium hover:border-[var(--accent)]"
            >
              Again
            </button>
          </div>
        ) : (
          <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-center sm:gap-10">
            <button
              type="button"
              disabled={phase !== "playing"}
              onPointerDown={startCharge}
              onPointerUp={releaseCharge}
              onPointerCancel={releaseCharge}
              onPointerLeave={(e) => {
                if (chargingRef.current) releaseCharge();
                e.currentTarget.releasePointerCapture?.(e.pointerId);
              }}
              className="relative select-none touch-none disabled:cursor-default"
              aria-label="Hold to charge slap, release to slap"
            >
              <div
                className="relative flex h-44 w-44 items-center justify-center rounded-full border-[3px] border-white/70 bg-[radial-gradient(circle_at_35%_30%,#fff7ea,#efd9b8)] shadow-[0_18px_40px_-20px_rgba(20,40,50,0.4)] sm:h-52 sm:w-52"
                style={{
                  transform: `rotate(${faceTilt}deg) scale(${slapFlash ? 0.96 : 1})`,
                  transition: slapFlash
                    ? "transform 80ms ease-out"
                    : "transform 280ms ease",
                }}
              >
                <span className="text-7xl sm:text-8xl" aria-hidden>
                  {faceMood}
                </span>
                {slapFlash ? (
                  <span
                    className="pointer-events-none absolute -right-2 top-6 font-[family-name:var(--font-display)] text-4xl text-[var(--accent-2)] sm:text-5xl"
                    style={{ transform: "rotate(12deg)" }}
                  >
                    ✋
                  </span>
                ) : null}
              </div>
              {popup ? (
                <p className="absolute -bottom-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--ink)] px-3 py-1 text-sm font-semibold text-white">
                  {popup}
                </p>
              ) : null}
            </button>

            <div className="flex w-full max-w-[9rem] flex-col items-center gap-2 sm:mb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Power
              </p>
              <div className="relative h-48 w-14 overflow-hidden rounded-full border-[3px] border-[#c4b5a0] bg-[#fffaf1]/85">
                <div
                  className="pointer-events-none absolute inset-x-0 z-10 border-y border-[var(--accent)]/60 bg-[var(--accent)]/20"
                  style={{ top: `${bandTop}%`, height: `${bandHeight}%` }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 transition-[height] duration-75"
                  style={{
                    height: `${powerPct}%`,
                    background:
                      "linear-gradient(180deg, #f0a070, #c45c26 55%, #8f3a14)",
                  }}
                />
              </div>
              <p className="text-center text-xs text-[var(--muted)]">
                {phase === "idle"
                  ? "Start, then hold"
                  : charging
                    ? "Release in green"
                    : "Hold to charge"}
              </p>
            </div>
          </div>
        )}

        {phase === "idle" ? (
          <div className="relative z-20 mt-8 flex justify-center">
            <button
              type="button"
              onClick={startRound}
              className="rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] px-8 py-3 font-[family-name:var(--font-display)] text-xl hover:border-[var(--accent)]"
            >
              是男人就给她一巴掌
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-sm text-[var(--muted)]">
        10-second round. Hold to charge, release in the green band for Perfect
        (+combo). Good/Miss resets combo.
      </p>
    </div>
  );
}
