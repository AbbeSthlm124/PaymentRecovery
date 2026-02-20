# Contact Form Worker (Formspree)

## Overview

- **Worker:** `sparkling-king-60e0`
- **No Resend, no domain verification** – contact form uses Formspree
- **URL:** `https://sparkling-king-60e0.abbe-stockholm1.workers.dev`
- **Contact endpoint:** `POST /submit`
- **Email service:** Formspree (free tier, no API key, no domain verification)

## Waitlist

**The waitlist is NOT in this Worker.** It runs in Next.js (`app/api/subscribe/route.ts`) and uses Resend. Do not modify.

## Setup

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form endpoint (e.g. `https://formspree.io/f/xxxxx`)
4. In Cloudflare Worker → Settings → Variables and Secrets, add:
   - `FORMSPREE_ENDPOINT` = your Formspree URL (e.g. `https://formspree.io/f/xxxxx`)
5. In Formspree, set notification email to `abbe_stockholm1@hotmail.com`

## Deploy

1. Cloudflare Dashboard → Workers & Pages → `sparkling-king-60e0`
2. Edit code → paste contents of `index.js`
3. Add `FORMSPREE_ENDPOINT` env var
4. Save and deploy

## CORS

Allowed origins:
- `https://paymentrecovery.io`
- `https://www.paymentrecovery.io`
- `http://localhost:3000` (and other localhost ports)
