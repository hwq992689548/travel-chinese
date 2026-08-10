import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refunds",
};

export default function RefundPage() {
  return (
    <article className="max-w-2xl space-y-4 text-[var(--ink)]">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        Refund Policy
      </h1>
      <p className="text-[var(--muted)]">Last updated: August 10, 2026</p>
      <p>
        Travel Chinese is sold as a one-time digital unlock. If you have a
        technical problem accessing content after payment, contact us within 7
        days and we will help restore access or issue a refund when appropriate.
      </p>
      <p>
        Demo unlocks (when Stripe is not configured) are free local previews and
        are not real purchases.
      </p>
    </article>
  );
}
