import Link from "next/link";

type Props = {
  title: string;
  blurb: string;
  children: React.ReactNode;
};

export function GameShell({ title, blurb, children }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/games"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
          >
            ← All mini games
          </Link>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-1 max-w-xl text-[var(--muted)]">{blurb}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
