import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // DEBUG: Redis connection info
    console.log("🔴 UNSUBSCRIBE API - Redis connection debug");
    console.log("Environment:", process.env.NODE_ENV || "undefined");
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "NOT SET";
    console.log("Redis URL (first 30 chars):", redisUrl === "NOT SET" ? redisUrl : redisUrl.substring(0, 30) + "...");
    try {
      await redis.set("debug:unsubapi:ping", "pong");
      const pingVal = await redis.get("debug:unsubapi:ping");
      console.log("Redis connection test:", pingVal === "pong" ? "✅ SUCCESS" : "❌ FAILED");
    } catch (e) {
      console.log("Redis connection test: ❌ ERROR", (e as Error).message);
    }

    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 400 }
      );
    }

    const email = await redis.get<string>(`unsub:${token}`);
    if (!email) {
      // DEBUG: Token not found - list keys and check for substring
      const allKeys = await redis.keys("unsub:*");
      console.log("Token not found. All unsub:* keys in Redis:", allKeys);
      const keysContainingToken = allKeys.filter((k: string) => k.includes(token));
      console.log("Keys containing requested token as substring:", keysContainingToken.length > 0 ? keysContainingToken : "NONE");
      return NextResponse.json(
        { success: true, message: "Already unsubscribed or invalid link" },
        { status: 200 }
      );
    }

    await redis.del(`unsub:${token}`);
    await redis.del(`sub:${email}`);
    await redis.set(`unsubscribed:${email}`, "1");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
