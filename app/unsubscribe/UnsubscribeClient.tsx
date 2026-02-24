"use client";

import { useState } from "react";
import Link from "next/link";

export default function UnsubscribeClient({ token }: { token: string | null }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleUnsubscribe = async () => {
    if (!token) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleNo = () => {
    window.location.href = "/";
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="max-w-md w-full p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid or expired link</h1>
          <p className="text-slate-400 mb-6">
            This unsubscribe link is invalid or has expired.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-accent-teal text-white font-semibold hover:bg-accent-tealLight transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="max-w-md w-full p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">You have been unsubscribed</h1>
          <p className="text-slate-400 mb-6">
            You will no longer receive emails from PaymentRecovery.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-accent-teal text-white font-semibold hover:bg-accent-tealLight transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="max-w-md w-full p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Do you want to unsubscribe?
        </h1>
        <p className="text-slate-400 mb-8 text-center">
          You will stop receiving emails from PaymentRecovery.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleUnsubscribe}
            disabled={status === "loading"}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold disabled:opacity-60"
          >
            {status === "loading" ? "Unsubscribing..." : "Yes, unsubscribe"}
          </button>
          <button
            type="button"
            onClick={handleNo}
            disabled={status === "loading"}
            className="px-6 py-3 rounded-xl backdrop-blur-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 disabled:opacity-60"
          >
            No, keep me subscribed
          </button>
        </div>
        {status === "error" && (
          <p className="mt-4 text-red-400 text-center text-sm">
            Something went wrong. Please try again or contact us.
          </p>
        )}
      </div>
    </div>
  );
}
