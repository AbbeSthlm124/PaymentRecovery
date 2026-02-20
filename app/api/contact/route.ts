import { NextResponse } from "next/server";

/**
 * Contact form uses Formspree - no Resend, no domain verification.
 * Waitlist (app/api/subscribe) still uses Resend - do not modify.
 */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: string, maxLen: number): string {
  return String(str)
    .replace(/[<>]/g, "")
    .slice(0, maxLen)
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, website } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (website && String(website).trim() !== "") {
      return NextResponse.json({ success: true });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
    if (!formspreeEndpoint) {
      console.error("FORMSPREE_ENDPOINT not set");
      return NextResponse.json(
        { success: false, error: "Something went wrong. Try again." },
        { status: 500 }
      );
    }

    const safeName = sanitize(name, 100);
    const safeEmail = sanitize(email, 254);
    const safeMessage = sanitize(message, 2000);

    const res = await fetch(formspreeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: safeName,
        email: safeEmail,
        _replyto: safeEmail,
        message: safeMessage,
        _subject: `New contact form: ${safeName}`,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Formspree error:", res.status, text);
      return NextResponse.json(
        { success: false, error: "Failed to send message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}
