import { Suspense } from "react";
import { kv } from "@vercel/kv";
import UnsubscribeClient from "./UnsubscribeClient";

export const dynamic = "force-dynamic";

async function getValidToken(token: string | null): Promise<string | null> {
  if (!token || typeof token !== "string" || token.length === 0) return null;
  try {
    const email = await kv.get<string>(`unsub:${token}`);
    return email ? token : null;
  } catch {
    return null;
  }
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string | string[] };
}) {
  const params = searchParams;
  const raw = params?.token;
  const rawToken = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] ?? null : null;
  const token = await getValidToken(rawToken);

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
