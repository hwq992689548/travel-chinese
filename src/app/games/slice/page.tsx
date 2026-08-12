import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { SliceRush } from "@/components/games/SliceRush";

export const metadata: Metadata = {
  title: "Stamp Slash",
};

export default function SlicePage() {
  return (
    <GameShell
      title="Stamp Slash"
      blurb="Swipe flying travel stamps — tickets, maps, cameras. Don't hit the 🚫 marks."
    >
      <SliceRush />
    </GameShell>
  );
}
