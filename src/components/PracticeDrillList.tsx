"use client";

import { speakChinese } from "@/lib/tts";
import type { PracticeItem } from "@/lib/types";

type Props = {
  items: PracticeItem[];
  showEnglish: boolean;
};

export function PracticeDrillList({ items, showEnglish }: Props) {
  if (!items?.length) return null;

  return (
    <section className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper-elevated)]/90 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
          Word & short-sentence practice
        </h2>
        <span className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          {items.length} drills
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        About 5–10 related word groups and short sentences — tap play on each
        line.
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.zh}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-chinese)] text-xl text-[var(--ink)] sm:text-2xl">
                {item.zh}
              </p>
              <p className="mt-1 text-sm text-[var(--accent)]">{item.pinyin}</p>
              {showEnglish ? (
                <p className="mt-1 text-sm text-[var(--muted)]">{item.en}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => speakChinese(item.zh, 1)}
                className="rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-[var(--paper)] hover:opacity-90"
              >
                Play
              </button>
              <button
                type="button"
                onClick={() => speakChinese(item.zh, 0.7)}
                className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
              >
                Slow
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
