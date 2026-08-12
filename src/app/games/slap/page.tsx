import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { SlapChallenge } from "@/components/games/SlapChallenge";

export const metadata: Metadata = {
  title: "Slap Challenge",
  description:
    "Hold to charge, release in the green band. 10 seconds — are you a man?",
};

export default function SlapPage() {
  return (
    <GameShell
      title="Slap Challenge"
      blurb="是男人就给她一巴掌 — hold to charge, slap in the green band. Beat the clock."
    >
      <SlapChallenge />
    </GameShell>
  );
}
