"use client";

import { useEffect, useMemo, useState } from "react";

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Cell = { id: number; n: number };

function buildBoard(size: number): Cell[] {
  return shuffle(
    Array.from({ length: size }, (_, i) => ({ id: i, n: i + 1 })),
  );
}

export function NumberPop() {
  const size = 12;
  const [board, setBoard] = useState<Cell[]>(() => buildBoard(size));
  const [next, setNext] = useState(1);
  const [wrong, setWrong] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const elapsed = useMemo(() => {
    if (startedAt == null) return 0;
    const end = finishedAt ?? now;
    return Math.max(0, end - startedAt);
  }, [startedAt, finishedAt, now]);

  useEffect(() => {
    const raw = localStorage.getItem("game-numberpop-best");
    if (raw) setBest(Number(raw));
  }, []);

  useEffect(() => {
    if (startedAt == null || finishedAt != null) return;
    const id = window.setInterval(() => setNow(Date.now()), 50);
    return () => window.clearInterval(id);
  }, [startedAt, finishedAt]);

  useEffect(() => {
    if (finishedAt == null || startedAt == null) return;
    const score = finishedAt - startedAt;
    setBest((prev) => {
      const nextBest = prev == null ? score : Math.min(prev, score);
      localStorage.setItem("game-numberpop-best", String(nextBest));
      return nextBest;
    });
  }, [finishedAt, startedAt]);

  function reset() {
    setBoard(buildBoard(size));
    setNext(1);
    setWrong(0);
    setStartedAt(null);
    setFinishedAt(null);
  }

  function tap(n: number) {
    if (finishedAt != null) return;
    if (startedAt == null) setStartedAt(Date.now());

    if (n !== next) {
      setWrong((w) => w + 1);
      return;
    }

    const upcoming = next + 1;
    setBoard((prev) => prev.filter((c) => c.n !== n));
    setNext(upcoming);
    if (upcoming > size) setFinishedAt(Date.now());
  }

  const seconds = (elapsed / 1000).toFixed(2);
  const bestSeconds = best != null ? (best / 1000).toFixed(2) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-[var(--muted)]">
          Next:{" "}
          <span className="font-semibold text-[var(--ink)]">
            {finishedAt ? "Done" : next}
          </span>
          {" · "}
          Time: <span className="font-semibold text-[var(--ink)]">{seconds}s</span>
          {" · "}
          Miss: <span className="font-semibold text-[var(--ink)]">{wrong}</span>
          {bestSeconds ? ` · Best: ${bestSeconds}s` : ""}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-[var(--line)] px-4 py-1.5 font-medium hover:border-[var(--accent)]"
        >
          New game
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {board.map((cell) => (
          <button
            key={cell.id}
            type="button"
            onClick={() => tap(cell.n)}
            className="flex aspect-square items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--paper-elevated)] font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] transition hover:border-[var(--accent)] active:scale-95 sm:text-3xl"
          >
            {cell.n}
          </button>
        ))}
        {finishedAt
          ? Array.from({ length: Math.max(0, 4 - (board.length % 4 || 4)) }).map(
              (_, i) => <div key={`pad-${i}`} />,
            )
          : null}
      </div>

      {finishedAt ? (
        <p className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-3 text-sm">
          Cleared 1→{size} in {seconds}s with {wrong} miss
          {wrong === 1 ? "" : "es"}. Try to beat your best.
        </p>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          Tap numbers in order from 1 to {size}. Speed counts — accuracy too.
        </p>
      )}
    </div>
  );
}
