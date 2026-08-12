import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { BubbleSoft } from "@/components/games/BubbleSoft";

export const metadata: Metadata = {
  title: "Bubble Soft",
};

export default function BubblesPage() {
  return (
    <GameShell
      title="Bubble Soft"
      blurb="Slow floating bubbles. Tap or swipe to pop — no timer, no fail."
    >
      <BubbleSoft />
    </GameShell>
  );
}
