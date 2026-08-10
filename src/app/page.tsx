import Link from "next/link";
import { getFreeCount, getTotalCount } from "@/lib/phrases";
import { COURSE_PRICE_DISPLAY, SCENES } from "@/lib/types";

export default function HomePage() {
  const freeCount = getFreeCount();
  const totalCount = getTotalCount();

  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--accent)]">
            Mandarin for the trip
          </p>
          <h1 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-[var(--ink)] sm:text-6xl">
            Travel Chinese
          </h1>
          <p className="mt-5 max-w-lg text-lg text-[var(--muted)]">
            Learn the phrases you&apos;ll actually say at the airport, hotel,
            restaurant, and on the street — with Chinese, pinyin, English, and
            one-tap pronunciation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/learn"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
            >
              Start free trial
            </Link>
            <Link
              href="/learn/airport"
              className="rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)]"
            >
              Try airport phrases
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            {freeCount} free phrases · {totalCount} in the full pack · unlock{" "}
            {COURSE_PRICE_DISPLAY} once
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper-elevated)] p-6 shadow-[0_24px_60px_-36px_rgba(18,40,48,0.45)]">
          <p className="text-sm text-[var(--muted)]">Sample card</p>
          <p className="mt-4 font-[family-name:var(--font-chinese)] text-4xl">
            有英文菜单吗？
          </p>
          <p className="mt-3 text-[var(--accent)]">yǒu yīng wén cài dān ma?</p>
          <p className="mt-2 text-[var(--muted)]">Do you have an English menu?</p>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            Restaurant · hear it · bookmark it
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Travel scenes & phrase packs
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          From airport to payment QR codes — pick what you need today. Each pack
          is short, spoken Mandarin, not a textbook marathon.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCENES.map((scene) => (
            <Link
              key={scene.id}
              href={`/learn/${scene.id}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--paper-elevated)]/80 p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
            >
              <div className="text-2xl">{scene.emoji}</div>
              <h3 className="mt-3 font-semibold text-[var(--ink)]">
                {scene.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{scene.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--ink)] px-6 py-8 text-[var(--paper)] sm:px-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Simple pricing
        </h2>
        <p className="mt-2 max-w-xl text-[color-mix(in_oklab,var(--paper)_80%,transparent)]">
          Try {freeCount} phrases free. Unlock the full Travel Chinese pack for{" "}
          {COURSE_PRICE_DISPLAY} — one payment, no subscription.
        </p>
        <Link
          href="/learn"
          className="mt-6 inline-flex rounded-full bg-[var(--accent-2)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          Browse the course
        </Link>
      </section>
    </div>
  );
}
