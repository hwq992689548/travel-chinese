"use client";

import { useEffect, useMemo, useState } from "react";

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const EMOJIS = ["✈️", "🍜", "🏨", "🚇", "💴", "📱", "🎟️", "🧭"];

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const pairs = shuffle([...EMOJIS, ...EMOJIS]);
  return pairs.map((emoji, id) => ({
    id,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const done = useMemo(
    () => cards.length > 0 && cards.every((c) => c.matched),
    [cards],
  );

  useEffect(() => {
    const raw = localStorage.getItem("game-memory-best");
    if (raw) setBest(Number(raw));
  }, []);

  useEffect(() => {
    if (!done || moves === 0) return;
    setBest((prev) => {
      const next = prev == null ? moves : Math.min(prev, moves);
      localStorage.setItem("game-memory-best", String(next));
      return next;
    });
  }, [done, moves]);

  function reset() {
    setCards(buildDeck());
    setPicked([]);
    setMoves(0);
    setLock(false);
  }

  function flip(id: number) {
    if (lock) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (picked.includes(id)) return;

    const nextPicked = [...picked, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
    );
    setPicked(nextPicked);

    if (nextPicked.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = nextPicked;
    const ca = cards.find((c) => c.id === a);
    const cb = cards.find((c) => c.id === b);
    if (!ca || !cb) return;

    if (ca.emoji === cb.emoji) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === a || c.id === b ? { ...c, matched: true } : c,
        ),
      );
      setPicked([]);
    } else {
      setLock(true);
      window.setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, flipped: false } : c,
          ),
        );
        setPicked([]);
        setLock(false);
      }, 650);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-[var(--muted)]">
          Moves: <span className="font-semibold text-[var(--ink)]">{moves}</span>
          {best != null ? ` · Best: ${best}` : ""}
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
        {cards.map((card) => {
          const show = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card.id)}
              className={`flex aspect-square items-center justify-center rounded-2xl border text-3xl transition sm:text-4xl ${
                card.matched
                  ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                  : show
                    ? "border-[var(--line)] bg-[var(--paper-elevated)]"
                    : "border-[var(--line)] bg-[var(--ink)] text-[var(--paper)] hover:brightness-110"
              }`}
            >
              {show ? card.emoji : "?"}
            </button>
          );
        })}
      </div>

      {done ? (
        <p className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-3 text-sm">
          Cleared in {moves} moves. Tap New game for another round.
        </p>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          Flip two cards. Match all travel-themed pairs.
        </p>
      )}
    </div>
  );
}
