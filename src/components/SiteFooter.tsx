import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Practical Mandarin phrases for trips to China.</p>
        <div className="flex gap-4">
          <Link className="hover:text-[var(--ink)]" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-[var(--ink)]" href="/refund">
            Refunds
          </Link>
        </div>
      </div>
    </footer>
  );
}
