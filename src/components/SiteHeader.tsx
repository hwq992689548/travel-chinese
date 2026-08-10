import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--paper)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--ink)] sm:text-2xl">
            Travel Chinese
          </span>
          <span className="hidden text-sm text-[var(--muted)] sm:inline">
            for travelers
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-[var(--ink)]">
          <Link className="hover:text-[var(--accent)]" href="/learn">
            Learn
          </Link>
          <Link className="hover:text-[var(--accent)]" href="/progress">
            Progress
          </Link>
        </nav>
      </div>
    </header>
  );
}
