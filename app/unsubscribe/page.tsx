"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
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
      <div className="min-h-screen bg-void-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid link</h1>
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
      <div className="min-h-screen bg-void-900 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Do you want to unsubscribe?
        </h1>
        <p className="text-slate-400 mb-8 text-center">
          You will stop receiving emails from PaymentRecovery.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            type="button"
            onClick={handleUnsubscribe}
            disabled={status === "loading"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Unsubscribing..." : "Yes, unsubscribe"}
          </motion.button>
          <motion.button
            type="button"
            onClick={handleNo}
            disabled={status === "loading"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl bg-void-700 hover:bg-void-600 text-white font-semibold border border-void-600 transition-colors disabled:opacity-60"
          >
            No, keep me subscribed
          </motion.button>
        </div>
        {status === "error" && (
          <p className="mt-4 text-red-400 text-center text-sm">
            Something went wrong. Please try again or contact us.
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-void-900 flex items-center justify-center">
          <p className="text-slate-400">Loading...</p>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
