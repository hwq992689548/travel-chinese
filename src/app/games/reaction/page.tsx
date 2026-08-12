import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { ReactionDash } from "@/components/games/ReactionDash";

export const metadata: Metadata = {
  title: "Reaction Dash",
};

export default function ReactionPage() {
  return (
    <GameShell
      title="Reaction Dash"
      blurb="A one-tap timing game. Green means go."
    >
      <ReactionDash />
    </GameShell>
  );
}
