import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mini Games",
  description:
    "Tiny browser games — calm poppers, pours, stamps, and quick challenges.",
};

const GAMES = [
  {
    href: "/games/bubbles",
    title: "Bubble Soft",
    blurb: "Pop slow floating bubbles. No timer, no fail.",
    emoji: "🫧",
  },
  {
    href: "/games/peel",
    title: "Stamp Peel",
    blurb: "Drag up to peel travel stickers.",
    emoji: "🏷️",
  },
  {
    href: "/games/tea",
    title: "Tea Pour",
    blurb: "Pour into the green band for a perfect cup.",
    emoji: "🫖",
  },
  {
    href: "/games/slice",
    title: "Stamp Slash",
    blurb: "Swipe travel stamps in the sky. Avoid 🚫 marks.",
    emoji: "🎫",
  },
  {
    href: "/games/time",
    title: "Time Guess",
    blurb: "Random target seconds. Start, then stop as close as you can.",
    emoji: "⏱️",
  },
  {
    href: "/games/reaction",
    title: "Reaction Dash",
    blurb: "Wait for green, then tap as fast as you can.",
    emoji: "⚡",
  },
  {
    href: "/games/memory",
    title: "Memory Match",
    blurb: "Flip cards and find all travel-themed pairs.",
    emoji: "🧠",
  },
  {
    href: "/games/numbers",
    title: "Number Pop",
    blurb: "Tap 1 through 12 in order — beat the clock.",
    emoji: "🔢",
  },
];

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
          Mini games
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Calm decompressors and quick challenges. No install, no account — just
          play.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {GAMES.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="rounded-2xl border border-[var(--line)] bg-[var(--paper-elevated)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
          >
            <div className="text-3xl">{game.emoji}</div>
            <h2 className="mt-3 text-xl font-semibold">{game.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{game.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
