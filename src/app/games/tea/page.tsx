import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { TeaPour } from "@/components/games/TeaPour";

export const metadata: Metadata = {
  title: "Tea Pour",
};

export default function TeaPage() {
  return (
    <GameShell
      title="Tea Pour"
      blurb="Hold to pour. Stop inside the green band for a perfect cup."
    >
      <TeaPour />
    </GameShell>
  );
}
