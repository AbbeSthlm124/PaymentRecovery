/**
 * Cloudflare Worker - sparkling-king-60e0
 * URL: https://sparkling-king-60e0.abbe-stockholm1.workers.dev
 *
 * ROUTES:
 * - POST /submit  → Contact form (uses Formspree - NO Resend, no domain verification)
 * - Waitlist is handled by Next.js app/api/subscribe - NOT in this Worker
 */

// Production + local dev. TODO: Remove localhost entries before production deploy.
const ALLOWED_ORIGINS = [
  "https://paymentrecovery.io",
  "https://www.paymentrecovery.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(body, status = 200, origin) {
  const headers = {
    "Content-Type": "application/json",
    ...(origin ? corsHeaders(origin) : {}),
  };
  return new Response(JSON.stringify(body), { status, headers });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str, maxLen = 500) {
  if (typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "")
    .slice(0, maxLen)
    .trim();
}

/** Send contact form via Formspree - no Resend, no domain verification */
async function sendContactViaFormspree(safeName, safeEmail, safeMessage, formspreeEndpoint) {
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
    throw new Error(`Formspree error ${res.status}: ${text}`);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = isAllowedOrigin(origin);

    console.log(`[Worker] ${request.method} ${url.pathname} Origin: ${origin || "(none)"} Allowed: ${allowed}`);

    // CORS preflight - must return 200 and Access-Control-Allow-Origin with exact origin
    if (request.method === "OPTIONS") {
      return new Response("", {
        status: 200,
        headers: allowed ? corsHeaders(origin) : {},
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { success: false, error: "Method not allowed" },
        405,
        allowed ? origin : null
      );
    }

    if (!allowed) {
      return jsonResponse(
        { success: false, error: "Forbidden" },
        403,
        null
      );
    }

    // ========== CONTACT FORM: POST /submit (Formspree - no Resend) ==========
    if (url.pathname === "/submit") {
      // Debug: simple connectivity test - return immediately
      if (url.searchParams.get("test") === "1") {
        return new Response("Connection OK", {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
            ...corsHeaders(origin),
          },
        });
      }

      try {
        let body = {};
        try {
          body = await request.json();
        } catch (e) {
          return jsonResponse(
            { success: false, error: "Invalid JSON body" },
            400,
            origin
          );
        }
        const { name, email, message, website } = body;

        if (!name || !email || !message) {
          return jsonResponse(
            { success: false, error: "Name, email, and message are required." },
            400,
            origin
          );
        }

        if (website && String(website).trim() !== "") {
          return jsonResponse({ success: true }, 200, origin);
        }

        if (!isValidEmail(email)) {
          return jsonResponse(
            { success: false, error: "Please enter a valid email." },
            400,
            origin
          );
        }

        const safeName = sanitize(name, 100);
        const safeEmail = sanitize(email, 254);
        const safeMessage = sanitize(message, 2000);

        const formspreeEndpoint = env.FORMSPREE_ENDPOINT;
        if (!formspreeEndpoint) {
          return jsonResponse(
            { success: false, error: "Something went wrong. Try again." },
            500,
            origin
          );
        }

        await sendContactViaFormspree(safeName, safeEmail, safeMessage, formspreeEndpoint);
        return jsonResponse({ success: true }, 200, origin);
      } catch (err) {
        console.error("Contact form error:", err);
        const reqOrigin = request.headers.get("Origin");
        const ok = isAllowedOrigin(reqOrigin || "");
        return jsonResponse(
          { success: false, error: "Failed to send message." },
          500,
          ok ? reqOrigin : null
        );
      }
    }

    return jsonResponse(
      { success: false, error: "Not found" },
      404,
      origin
    );
  },
};
