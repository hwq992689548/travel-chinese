import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral max-w-2xl space-y-4 text-[var(--ink)]">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        Privacy Policy
      </h1>
      <p className="text-[var(--muted)]">Last updated: August 10, 2026</p>
      <p>
        Travel Chinese is a phrase-learning site. Learning progress and unlock
        status are stored in your browser (localStorage) on this device.
      </p>
      <p>
        If you purchase the full course, payment is processed by Stripe. We
        receive limited payment metadata (such as payment status and email if
        provided to Stripe) to confirm your unlock.
      </p>
      <p>
        We do not sell personal information. Contact the site operator if you
        have privacy questions.
      </p>
    </article>
  );
}
