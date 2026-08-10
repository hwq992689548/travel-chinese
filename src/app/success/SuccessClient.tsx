"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { setUnlocked } from "@/lib/progress";

export function SuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    async function verify() {
      try {
        if (!sessionId) {
          setUnlocked(true);
          setStatus("ok");
          return;
        }
        const res = await fetch(
          `/api/verify-session?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await res.json()) as { unlocked?: boolean };
        if (data.unlocked) {
          setUnlocked(true);
          setStatus("ok");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }
    void verify();
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg space-y-4 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">
        {status === "ok"
          ? "You're unlocked"
          : status === "loading"
            ? "Confirming payment…"
            : "Something went wrong"}
      </h1>
      <p className="text-[var(--muted)]">
        {status === "ok"
          ? "Full course access is saved on this device. Jump back into any scene."
          : status === "loading"
            ? "Hang tight while we verify your checkout session."
            : "We couldn't confirm the payment. If you were charged, contact support with your receipt."}
      </p>
      <Link
        href="/learn"
        className="inline-flex rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Continue learning
      </Link>
    </div>
  );
}
