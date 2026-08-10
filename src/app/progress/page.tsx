"use client";

import Link from "next/link";
import { useMemo } from "react";
import { UnlockPanel } from "@/components/UnlockPanel";
import { useProgress } from "@/hooks/useProgress";
import { getAllPhrases } from "@/lib/phrases";
import { SCENES } from "@/lib/types";

export default function ProgressPage() {
  const { progress, unlocked, ready } = useProgress();
  const all = useMemo(() => getAllPhrases(), []);

  if (!ready) {
    return <p className="text-[var(--muted)]">Loading progress…</p>;
  }

  const studiedSet = new Set(progress.studied);
  const bookmarkSet = new Set(progress.bookmarked);
  const bookmarkedPhrases = all.filter((p) => bookmarkSet.has(p.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">
          Your progress
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Saved in this browser only — no account required for the MVP.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Studied" value={String(progress.studied.length)} />
        <Stat label="Bookmarked" value={String(progress.bookmarked.length)} />
        <Stat label="Access" value={unlocked ? "Full course" : "Free trial"} />
      </div>

      <UnlockPanel unlocked={unlocked} />

      <section>
        <h2 className="text-lg font-semibold">By scene</h2>
        <ul className="mt-3 space-y-2">
          {SCENES.map((scene) => {
            const scenePhrases = all.filter((p) => p.scene === scene.id);
            const done = scenePhrases.filter((p) => studiedSet.has(p.id)).length;
            return (
              <li key={scene.id}>
                <Link
                  href={`/learn/${scene.id}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] px-4 py-3 hover:border-[var(--accent)]"
                >
                  <span>
                    {scene.emoji} {scene.title}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    {done}/{scenePhrases.length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {bookmarkedPhrases.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold">Bookmarks</h2>
          <ul className="mt-3 space-y-2">
            {bookmarkedPhrases.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-[var(--line)] bg-[var(--paper-elevated)] px-4 py-3"
              >
                <p className="font-[family-name:var(--font-chinese)] text-xl">
                  {p.zh}
                </p>
                <p className="text-sm text-[var(--accent)]">{p.pinyin}</p>
                <p className="text-sm text-[var(--muted)]">{p.en}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-elevated)] p-5">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl">
        {value}
      </p>
    </div>
  );
}
