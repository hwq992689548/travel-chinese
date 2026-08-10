"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  canAccessPhrase,
  markStudied,
  toggleBookmark,
} from "@/lib/progress";
import { speakChinese, stopSpeaking } from "@/lib/tts";
import type { Phrase } from "@/lib/types";
import { useProgress } from "@/hooks/useProgress";
import { PracticeDrillList } from "./PracticeDrillList";
import { UnlockPanel } from "./UnlockPanel";

type Props = {
  sceneTitle: string;
  phrases: Phrase[];
};

export function PhraseTrainer({ sceneTitle, phrases }: Props) {
  const { progress, unlocked, ready } = useProgress();
  const [index, setIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(true);
  const [ttsOk, setTtsOk] = useState(true);

  const accessible = useMemo(() => {
    if (!ready) return phrases.filter((p) => p.free);
    return phrases.filter((p) => canAccessPhrase(p.free));
  }, [phrases, ready, unlocked]);

  const lockedCount = phrases.length - accessible.length;
  const phrase = accessible[Math.min(index, Math.max(accessible.length - 1, 0))];

  useEffect(() => {
    setIndex(0);
  }, [sceneTitle]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (!phrase) {
    return (
      <div className="space-y-4">
        <p className="text-[var(--muted)]">
          No free phrases left in this scene. Unlock the full course to continue.
        </p>
        <UnlockPanel unlocked={unlocked} />
        <Link href="/learn" className="text-sm text-[var(--accent)] underline">
          Back to scenes
        </Link>
      </div>
    );
  }

  const bookmarked = progress.bookmarked.includes(phrase.id);
  const studied = progress.studied.includes(phrase.id);

  function play(rate: number) {
    const ok = speakChinese(phrase.zh, rate);
    setTtsOk(ok);
    markStudied(phrase.id);
  }

  function go(delta: number) {
    stopSpeaking();
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return accessible.length - 1;
      if (next >= accessible.length) return 0;
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
            {sceneTitle}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            Phrase practice
          </h1>
        </div>
        <p className="text-sm text-[var(--muted)]">
          {Math.min(index + 1, accessible.length)} / {accessible.length}
          {lockedCount > 0 ? ` · ${lockedCount} locked` : ""}
        </p>
      </div>

      <article className="relative overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper-elevated)] px-6 py-10 shadow-[0_24px_60px_-36px_rgba(18,40,48,0.55)] sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--accent),var(--accent-2))]"
        />
        <p className="text-center font-[family-name:var(--font-chinese)] text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
          {phrase.zh}
        </p>
        <p className="mt-4 text-center text-lg text-[var(--accent)] sm:text-xl">
          {phrase.pinyin}
        </p>
        {showEnglish ? (
          <p className="mt-6 text-center text-base text-[var(--muted)] sm:text-lg">
            {phrase.en}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setShowEnglish(true)}
            className="mx-auto mt-6 block text-sm text-[var(--accent)] underline"
          >
            Reveal English
          </button>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => play(1)}
            className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--paper)] hover:opacity-90"
          >
            Play
          </button>
          <button
            type="button"
            onClick={() => play(0.7)}
            className="rounded-full border border-[var(--line)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
          >
            Slow
          </button>
          <button
            type="button"
            onClick={() => toggleBookmark(phrase.id)}
            className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
          >
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
          <button
            type="button"
            onClick={() => setShowEnglish((v) => !v)}
            className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
          >
            {showEnglish ? "Hide English" : "Show English"}
          </button>
        </div>

        {!ttsOk ? (
          <p className="mt-4 text-center text-xs text-amber-800">
            Speech synthesis is unavailable in this browser. Try Chrome or Edge.
          </p>
        ) : null}

        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          {studied ? "Marked as studied on this device." : "Play to mark as studied."}
          {" · "}Pronunciation uses your browser TTS (zh-CN).
        </p>
      </article>

      <PracticeDrillList
        items={phrase.practice ?? []}
        showEnglish={showEnglish}
      />

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium hover:border-[var(--accent)]"
        >
          Previous
        </button>
        <Link href="/learn" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
          All scenes
        </Link>
        <button
          type="button"
          onClick={() => go(1)}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          Next
        </button>
      </div>

      {lockedCount > 0 ? <UnlockPanel unlocked={unlocked} /> : null}
    </div>
  );
}
