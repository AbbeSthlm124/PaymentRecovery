import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export const dynamic = "force-dynamic";

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string | string[] };
}) {
  const raw = searchParams?.token;
  const token = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] ?? null : null;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-void-900 flex items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <UnsubscribeClient token={token} />
    </Suspense>
  );
}
