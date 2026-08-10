import { Suspense } from "react";
import { SuccessClient } from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-[var(--muted)]">Confirming payment…</p>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
