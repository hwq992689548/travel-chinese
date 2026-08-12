import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { MemoryMatch } from "@/components/games/MemoryMatch";

export const metadata: Metadata = {
  title: "Memory Match",
};

export default function MemoryPage() {
  return (
    <GameShell
      title="Memory Match"
      blurb="Find every matching pair with as few moves as possible."
    >
      <MemoryMatch />
    </GameShell>
  );
}
