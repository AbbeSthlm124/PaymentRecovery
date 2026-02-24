"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Try again.");
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 px-6 overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 mb-8">
          <span className="text-slate-400 text-sm">Built for Memberships · Communities · Newsletters · Courses</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-white leading-[1.1] max-w-5xl mx-auto">
          Stop Losing Revenue to{" "}
          <span className="bg-gradient-to-r from-accent-teal via-accent-tealLight to-accent-teal bg-clip-text text-transparent">
            Failed Payments
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          Smart recovery for Stripe subscriptions. We retry failed payments automatically – you keep customers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-10 max-w-md mx-auto sm:max-w-lg"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === "loading"}
            className="w-full sm:flex-1 px-6 py-3.5 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all disabled:opacity-60"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent-teal text-white font-semibold hover:bg-accent-tealLight hover:shadow-lg hover:shadow-accent-teal/25 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Joining..." : "Get Early Access"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-accent-teal font-medium">
            You&apos;re on the list! Check your email.
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-400 font-medium">
            {errorMessage}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 mt-8 text-slate-500">
          <Check className="w-5 h-5 text-accent-teal flex-shrink-0" strokeWidth={2.5} />
          <span className="text-sm md:text-base">Join 50+ SaaS founders recovering failed payments</span>
        </div>
      </div>
    </section>
  );
}
