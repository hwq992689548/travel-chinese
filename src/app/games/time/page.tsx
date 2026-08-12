import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { TimeGuess } from "@/components/games/TimeGuess";

export const metadata: Metadata = {
  title: "Time Guess",
};

export default function TimeGuessPage() {
  return (
    <GameShell
      title="Time Guess"
      blurb="Get a random target (1–60s). Start, feel the time, stop as close as you can."
    >
      <TimeGuess />
    </GameShell>
  );
}
