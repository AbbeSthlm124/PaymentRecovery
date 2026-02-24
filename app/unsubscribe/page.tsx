import { Suspense } from "react";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
import UnsubscribeClient from "./UnsubscribeClient";

export const dynamic = "force-dynamic";

async function getValidToken(token: string | null): Promise<string | null> {
  // DEBUG: Redis connection info
  console.log("🔴 UNSUBSCRIBE PAGE - Redis connection debug");
  console.log("Environment:", process.env.NODE_ENV || "undefined");
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "NOT SET";
  console.log("Redis URL (first 30 chars):", redisUrl === "NOT SET" ? redisUrl : redisUrl.substring(0, 30) + "...");
  try {
    await redis.set("debug:unsubpage:ping", "pong");
    const pingVal = await redis.get("debug:unsubpage:ping");
    console.log("Redis connection test:", pingVal === "pong" ? "✅ SUCCESS" : "❌ FAILED");
  } catch (e) {
    console.log("Redis connection test: ❌ ERROR", (e as Error).message);
  }
  console.log("Token from URL:", token);

  if (!token || typeof token !== "string" || token.length === 0) return null;
  try {
    const email = await redis.get<string>(`unsub:${token}`);
    console.log("Redis lookup result:", email);

    if (!email) {
      console.log("No email found for token:", token);

      // List all unsub:* keys and check if token appears as substring in any key
      const allKeys = await redis.keys("unsub:*");
      console.log("All unsub:* keys in Redis:", allKeys);
      const keysContainingToken = allKeys.filter((k) => k.includes(token));
      console.log("Keys containing requested token as substring:", keysContainingToken.length > 0 ? keysContainingToken : "NONE");
    } else {
      console.log("Found email:", email);
    }

    return email ? token : null;
  } catch (error) {
    console.error("Redis error in unsubscribe page:", error);
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

  // DEBUG: Log raw URL params before processing
  console.log("========== UNSUBSCRIBE DEBUG ==========");
  console.log("1. Raw searchParams.token:", raw);
  console.log("2. Parsed token:", rawToken);
  console.log("3. Token length:", rawToken?.length ?? 0);
  if (rawToken) {
    console.log("4. Redis key we will lookup: unsub:" + rawToken);
  }
  console.log("======================================");

  const token = await getValidToken(rawToken);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <UnsubscribeClient token={token} />
    </Suspense>
  );
}
