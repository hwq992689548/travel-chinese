"use client";

import { useProgress } from "@/hooks/useProgress";
import { UnlockPanel } from "./UnlockPanel";

export function UnlockPanelClient() {
  const { unlocked, ready } = useProgress();
  if (!ready) {
    return (
      <div className="h-28 animate-pulse rounded-2xl border border-[var(--line)] bg-[var(--paper-elevated)]" />
    );
  }
  return <UnlockPanel unlocked={unlocked} />;
}
