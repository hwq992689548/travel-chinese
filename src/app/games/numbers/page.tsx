import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { NumberPop } from "@/components/games/NumberPop";

export const metadata: Metadata = {
  title: "Number Pop",
};

export default function NumbersPage() {
  return (
    <GameShell
      title="Number Pop"
      blurb="Clear the board by tapping numbers in order from 1 to 12."
    >
      <NumberPop />
    </GameShell>
  );
}
