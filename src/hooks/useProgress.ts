"use client";

import { useEffect, useState } from "react";
import {
  getProgress,
  isUnlocked,
  type ProgressState,
} from "@/lib/progress";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>({
    studied: [],
    bookmarked: [],
  });
  const [unlocked, setUnlockedState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setProgress(getProgress());
      setUnlockedState(isUnlocked());
      setReady(true);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("travel-chinese-progress", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("travel-chinese-progress", sync);
    };
  }, []);

  return { progress, unlocked, ready };
}
