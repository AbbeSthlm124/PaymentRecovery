import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;
// Use environment variable if available, otherwise determine by environment
const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "https://www.paymentrecovery.io" : "http://localhost:3000");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getLogoDataUri(): string {
  try {
    // logo-email.png is generated from logo.svg (single source of truth)
    const pngPath = join(process.cwd(), "public", "logo-email.png");
    const buffer = readFileSync(pngPath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return "";
  }
}

function getWaitlistEmailHtml(unsubscribeToken: string): string {
  const logoSrc = getLogoDataUri();
  const unsubscribeUrl = `${SITE_URL}${BASE_PATH}/unsubscribe?token=${unsubscribeToken}`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the PaymentRecovery waitlist</title>
</head>
<body style="margin: 0; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0A; color: #e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 24px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          <tr>
            <td style="padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.1);">
              ${logoSrc ? `<img src="${logoSrc}" alt="PaymentRecovery" width="240" height="50" style="display: block; width: 240px; height: 50px; border: 0;" />` : `<span style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 500; color: #ffffff;">PaymentRecovery</span>`}
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 0;">
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7; color: #94a3b8;">Hi there,</p>
              <p style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">You're on the PaymentRecovery waitlist</p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #94a3b8;">Smart recovery for Stripe subscriptions. We retry failed payments automatically – you keep customers.</p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7; color: #94a3b8;">Built for memberships, communities, newsletters, and courses. Early users reclaim 20–35% of otherwise lost revenue.</p>
              <p style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #ffffff;">What's next:</p>
              <p style="margin: 0 0 8px; font-size: 15px; color: #cbd5e1;"><span style="color: #14b8a6;">✓</span> We'll notify you when we launch</p>
              <p style="margin: 0 0 8px; font-size: 15px; color: #cbd5e1;"><span style="color: #14b8a6;">✓</span> 50% off your first year – first 100 spots</p>
              <p style="margin: 0 0 24px; font-size: 15px; color: #cbd5e1;"><span style="color: #14b8a6;">✓</span> No spam, just product updates</p>
              <p style="margin: 0 0 32px; font-size: 14px; color: #64748b;"><span style="color: #14b8a6;">✓</span> Join 50+ SaaS founders recovering failed payments</p>
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #ffffff;">PaymentRecovery Team</p>
              <p style="margin: 16px 0 0; font-size: 14px; color: #64748b;">Questions? <a href="mailto:contact@paymentrecovery.io" style="color: #14b8a6; text-decoration: none;">contact@paymentrecovery.io</a></p>
              <p style="margin: 16px 0 0; font-size: 11px; color: #64748b;"><a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> from these emails</p>
              <p style="margin: 24px 0 0; font-size: 11px; color: #475569;">Stop Losing Revenue to Failed Payments</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function getWelcomeEmailText(unsubscribeToken: string): string {
  return `PaymentRecovery

Hi there,

You're on the PaymentRecovery waitlist. Smart recovery for Stripe subscriptions – we retry failed payments automatically, you keep customers.

Built for memberships, communities, newsletters, and courses. Early users reclaim 20–35% of otherwise lost revenue.

What's next:
- We'll notify you when we launch
- 50% off your first year – first 100 spots
- No spam, just product updates

Join 50+ SaaS founders recovering failed payments.

PaymentRecovery Team

Questions? contact@paymentrecovery.io

Unsubscribe: ${SITE_URL}${BASE_PATH}/unsubscribe?token=${unsubscribeToken}`;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Something went wrong. Try again." },
        { status: 500 }
      );
    }

    // ========== EXTREME DEBUG START ==========
    console.log("\n🔴🔴🔴🔴🔴 NEW SUBSCRIBE ATTEMPT 🔴🔴🔴🔴🔴");
    console.log("Time:", new Date().toISOString());
    console.log("Environment:", process.env.NODE_ENV || "undefined");
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "NOT SET";
    console.log("Redis URL (first 30 chars):", redisUrl === "NOT SET" ? redisUrl : redisUrl.substring(0, 30) + "...");
    try {
      await redis.set("debug:subscribe:ping", "pong");
      const pingVal = await redis.get("debug:subscribe:ping");
      console.log("Redis connection test:", pingVal === "pong" ? "✅ SUCCESS" : "❌ FAILED");
    } catch (e) {
      console.log("Redis connection test: ❌ ERROR", (e as Error).message);
    }
    console.log("Email:", trimmedEmail);

    // Generate token
    const token = randomUUID();
    console.log("1️⃣ TOKEN GENERATED:", token);
    console.log("1a Token length:", token.length);
    console.log("1b Token type:", typeof token);

    // Save to Redis (@upstash/redis uses set with ex option, not setex)
    try {
      await redis.set(`unsub:${token}`, trimmedEmail, {
        ex: THIRTY_DAYS_SECONDS,
      });
      await redis.set(`sub:${trimmedEmail}`, token, {
        ex: THIRTY_DAYS_SECONDS,
      });
      console.log("2️⃣ TOKEN SAVED TO REDIS");

      // Verify save
      const verify = await redis.get<string>(`unsub:${token}`);
      console.log("2a VERIFICATION READ:", verify);
      console.log("2b MATCHES EMAIL?", verify === trimmedEmail ? "✅ YES" : "❌ NO");

      // List all unsub:* keys and confirm new token is in list
      const allUnsubKeys = await redis.keys("unsub:*");
      console.log("2c ALL unsub:* keys in Redis:", allUnsubKeys);
      const expectedKey = `unsub:${token}`;
      const newTokenInList = allUnsubKeys.includes(expectedKey);
      console.log("2d Newly saved token in list?", newTokenInList ? "✅ YES" : "❌ NO", `(expected: ${expectedKey})`);
    } catch (e) {
      console.log("2️⃣ REDIS ERROR:", (e as Error).message);
      return NextResponse.json(
        { error: "Failed to save subscription. Try again." },
        { status: 500 }
      );
    }

    // Build unsubscribe URL
    const baseUrl = SITE_URL + BASE_PATH;
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${token}`;
    console.log("3️⃣ UNSUBSCRIBE URL:", unsubscribeUrl);

    // Generate email HTML
    console.log("4️⃣ CALLING getWaitlistEmailHtml with token:", token);
    const emailHtml = getWaitlistEmailHtml(token);
    console.log("4a HTML contains token?", emailHtml.includes(token) ? "✅ YES" : "❌ NO");

    // SEARCH FOR ANY OTHER TOKEN IN HTML
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const foundTokens = emailHtml.match(uuidRegex) || [];
    console.log("4b ALL UUIDs found in HTML:", foundTokens);
    console.log("4c HTML preview (first 300 chars):", emailHtml.substring(0, 300));

    // Generate email text
    const emailText = getWelcomeEmailText(token);
    console.log("5️⃣ TEXT contains token?", emailText.includes(token) ? "✅ YES" : "❌ NO");

    // Send email
    console.log("6️⃣ SENDING EMAIL VIA RESEND");
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "PaymentRecovery Team <noreply@mail.paymentrecovery.io>",
      to: trimmedEmail,
      subject: "You're on the PaymentRecovery waitlist",
      html: emailHtml,
      text: emailText,
    });

    console.log("6a RESEND RESPONSE:", {
      success: !!data,
      error: error?.message,
      id: data?.id,
    });

    console.log("🔴🔴🔴🔴🔴 EXTREME DEBUG END 🔴🔴🔴🔴🔴\n");
    // ========== EXTREME DEBUG END ==========

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("❌ FATAL ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
