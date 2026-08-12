import type { Metadata } from "next";
import { GameShell } from "@/components/games/GameShell";
import { StampPeel } from "@/components/games/StampPeel";

export const metadata: Metadata = {
  title: "Stamp Peel",
};

export default function PeelPage() {
  return (
    <GameShell
      title="Stamp Peel"
      blurb="Drag upward to peel travel stickers. Soft, endless, satisfying."
    >
      <StampPeel />
    </GameShell>
  );
}
