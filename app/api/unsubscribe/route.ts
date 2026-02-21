import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 400 }
      );
    }

    const email = await kv.get<string>(`unsub:${token}`);
    if (!email) {
      return NextResponse.json(
        { success: true, message: "Already unsubscribed or invalid link" },
        { status: 200 }
      );
    }

    await kv.del(`unsub:${token}`);
    await kv.set(`unsubscribed:${email}`, "1");
    await kv.del(`subscribed:${email}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
