"use client";

import { useState } from "react";
import { setUnlocked } from "@/lib/progress";
import { COURSE_PRICE_DISPLAY } from "@/lib/types";

type Props = {
  unlocked: boolean;
};

export function UnlockPanel({ unlocked }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (unlocked) {
    return (
      <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--ink)]">
        Full course unlocked on this device. Enjoy every scene.
      </div>
    );
  }

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as {
        url?: string;
        demo?: boolean;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.demo) {
        setUnlocked(true);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-elevated)] p-5 shadow-[0_10px_40px_-24px_rgba(20,40,50,0.45)]">
      <p className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
        Unlock all phrases
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        One-time purchase {COURSE_PRICE_DISPLAY}. Keep practicing airport,
        hotel, restaurant, and more — no subscription.
      </p>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Starting…" : `Unlock full course · ${COURSE_PRICE_DISPLAY}`}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      <p className="mt-3 text-xs text-[var(--muted)]">
        Without Stripe keys, unlock runs in demo mode on this device so you can
        preview the paid experience.
      </p>
    </div>
  );
}
