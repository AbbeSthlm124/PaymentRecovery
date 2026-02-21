import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";
import { kv } from "@vercel/kv";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
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
<body style="margin: 0; padding: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #070b10; color: #e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 24px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          <tr>
            <td style="padding-bottom: 32px; border-bottom: 1px solid #1e293b;">
              ${logoSrc ? `<img src="${logoSrc}" alt="PaymentRecovery" width="240" height="50" style="display: block; width: 240px; height: 50px; border: 0;" />` : `<span style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 500; color: #ffffff;">PaymentRecovery</span>`}
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 0;">
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7; color: #94a3b8;">Hi there,</p>
              <p style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">You're on the PaymentRecovery waitlist</p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #94a3b8;">Thanks for joining. We're building a tool that helps SaaS companies recover failed subscription payments automatically. Early users reclaim 20-35% of otherwise lost revenue.</p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7; color: #94a3b8;">As a waitlist member, you'll get 50% off your first year when we launch. First 100 spots only.</p>
              <p style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #ffffff;">What's next:</p>
              <p style="margin: 0 0 8px; font-size: 15px; color: #cbd5e1;"><span style="color: #14b8a6;">✓</span> We'll notify you when we launch</p>
              <p style="margin: 0 0 8px; font-size: 15px; color: #cbd5e1;"><span style="color: #14b8a6;">✓</span> First 100 spots only</p>
              <p style="margin: 0 0 24px; font-size: 15px; color: #cbd5e1;"><span style="color: #14b8a6;">✓</span> No spam, just product updates</p>
              <p style="margin: 0 0 32px; font-size: 14px; color: #64748b;"><span style="color: #14b8a6;">✓</span> Join 50+ SaaS founders already on the waitlist</p>
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #ffffff;">PaymentRecovery Team</p>
              <p style="margin: 16px 0 0; font-size: 14px; color: #64748b;">Questions? Contact us at <a href="mailto:contact@paymentrecovery.io" style="color: #14b8a6; text-decoration: none;">contact@paymentrecovery.io</a></p>
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

You're on the PaymentRecovery waitlist. Thanks for joining.

We're building a tool that helps SaaS companies recover failed subscription payments automatically. Early users reclaim 20-35% of otherwise lost revenue.

As a waitlist member, you'll get 50% off your first year when we launch. First 100 spots only.

What's next:
- We'll notify you when we launch
- First 100 spots only
- No spam, just product updates

Join 50+ SaaS founders already on the waitlist.

PaymentRecovery Team

Questions? Contact us at contact@paymentrecovery.io

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

    const token = randomUUID();
    const kvOptions = { ex: THIRTY_DAYS_SECONDS } as const;
    try {
      await kv.set(`unsub:${token}`, trimmedEmail, kvOptions);
      await kv.set(`sub:${trimmedEmail}`, token, kvOptions);
    } catch (kvErr) {
      console.error("KV storage error:", kvErr);
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "PaymentRecovery Team <noreply@mail.paymentrecovery.io>",
      to: trimmedEmail,
      subject: "You're on the PaymentRecovery waitlist",
      html: getWaitlistEmailHtml(token),
      text: getWelcomeEmailText(token),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
