import type { Metadata } from "next";
import Link from "next/link";
import { getPhrasesByScene } from "@/lib/phrases";
import { SCENES } from "@/lib/types";
import { UnlockPanelClient } from "@/components/UnlockPanelClient";

export const metadata: Metadata = {
  title: "Learn",
  description: "Choose a travel scene and practice Mandarin phrases.",
};

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
          Choose a scene
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Free phrases are unlocked from the start. Unlock the full course anytime
          to open every scene.
        </p>
      </div>

      <UnlockPanelClient />

      <div className="grid gap-4 sm:grid-cols-2">
        {SCENES.map((scene) => {
          const count = getPhrasesByScene(scene.id).length;
          const free = getPhrasesByScene(scene.id).filter((p) => p.free).length;
          return (
            <Link
              key={scene.id}
              href={`/learn/${scene.id}`}
              className="rounded-2xl border border-[var(--line)] bg-[var(--paper-elevated)] p-6 transition hover:border-[var(--accent)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-2xl">{scene.emoji}</div>
                  <h2 className="mt-3 text-xl font-semibold">{scene.title}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{scene.blurb}</p>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                  {free}/{count} free
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
