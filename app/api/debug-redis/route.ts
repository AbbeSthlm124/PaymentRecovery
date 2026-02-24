import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Try both methods to see which works
const redisFromEnv = Redis.fromEnv();

export async function GET() {
  // @upstash/redis fromEnv() uses: UPSTASH_REDIS_REST_URL || KV_REST_API_URL (same order)
  const resolvedUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const resolvedToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      // Which URL @upstash/redis actually uses (first match wins)
      resolvedUrlPrefix: resolvedUrl ? resolvedUrl.substring(0, 50) + "..." : "NOT SET",
      resolvedUrlSource: process.env.UPSTASH_REDIS_REST_URL ? "UPSTASH_REDIS_REST_URL" : process.env.KV_REST_API_URL ? "KV_REST_API_URL" : "NONE",
      isUpstashHost: resolvedUrl?.includes("upstash.io") ?? false,
      hasKvUrl: !!process.env.KV_REST_API_URL,
      hasKvToken: !!process.env.KV_REST_API_TOKEN,
      hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      kvUrlPrefix: process.env.KV_REST_API_URL?.substring(0, 30) + "...",
      upstashUrlPrefix: process.env.UPSTASH_REDIS_REST_URL?.substring(0, 30) + "...",
    },
    tests: {} as Record<string, unknown>,
    errors: [] as string[],
  };

  // Test 1: Basic connection with fromEnv()
  try {
    await redisFromEnv.set("debug:test:env", "working");
    const val = await redisFromEnv.get("debug:test:env");
    results.tests.fromEnv = val === "working" ? "✅ PASSED" : "❌ FAILED";
  } catch (e) {
    results.tests.fromEnv = "❌ ERROR";
    results.errors.push(`fromEnv error: ${(e as Error).message}`);
  }

  // Test 2: Basic connection with explicit (KV_REST_* or UPSTASH_*)
  try {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      results.tests.explicit = "⏭️ SKIPPED (no URL or token in env)";
    } else {
      const redisExplicit = new Redis({ url, token });
      await redisExplicit.set("debug:test:explicit", "working");
      const val = await redisExplicit.get("debug:test:explicit");
      results.tests.explicit = val === "working" ? "✅ PASSED" : "❌ FAILED";
    }
  } catch (e) {
    results.tests.explicit = "❌ ERROR";
    results.errors.push(`explicit error: ${(e as Error).message}`);
  }

  // Test 3: Set with expiration (using set + ex option - @upstash/redis style)
  try {
    await redisFromEnv.set("debug:test:expire", "test", { ex: 60 });
    results.tests.setWithEx = "✅ PASSED";
  } catch (e) {
    results.tests.setWithEx = "❌ FAILED";
    results.errors.push(`set with ex error: ${(e as Error).message}`);
  }

  // Test 4: Try to find any existing unsubscribe tokens
  try {
    const keys = await redisFromEnv.keys("unsub:*");
    results.tests.existingTokens = {
      count: keys.length,
      sample: keys.slice(0, 5),
    };
  } catch (e) {
    results.tests.existingTokens = `❌ ERROR: ${(e as Error).message}`;
  }

  // Test 5: Try to find any sub:* keys
  try {
    const subKeys = await redisFromEnv.keys("sub:*");
    results.tests.subKeys = {
      count: subKeys.length,
      sample: subKeys.slice(0, 5),
    };
  } catch (e) {
    results.tests.subKeys = `❌ ERROR: ${(e as Error).message}`;
  }

  // Test 6: Write and read back a test token (matches subscribe flow)
  const testToken = `test-${Date.now()}`;
  const testEmail = "test@example.com";

  try {
    await redisFromEnv.set(`unsub:${testToken}`, testEmail, { ex: 60 });
    const readBack = await redisFromEnv.get<string>(`unsub:${testToken}`);
    results.tests.writeRead = {
      token: testToken,
      written: testEmail,
      read: readBack,
      match: readBack === testEmail ? "✅ YES" : "❌ NO",
    };
  } catch (e) {
    results.tests.writeRead = `❌ ERROR: ${(e as Error).message}`;
  }

  return NextResponse.json(results);
}
