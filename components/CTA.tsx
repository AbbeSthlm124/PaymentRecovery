"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CTA() {
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
    <section
      id="cta"
      className="py-24 px-6 scroll-mt-20 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20, 184, 166, 0.08) 0%, transparent 50%, rgba(7, 11, 16, 1) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(20,184,166,0.12)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-6"
        >
          Ready to recover your revenue?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-slate-500 text-lg mb-10"
        >
          Join the waitlist and be first to recover failed payments automatically.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === "loading"}
            className="w-full sm:flex-1 max-w-md px-6 py-3.5 bg-void-800/80 border border-void-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal transition-all disabled:opacity-60"
            required
          />
          <motion.button
            type="submit"
            disabled={status === "loading"}
            whileHover={status === "idle" ? { scale: 1.02 } : {}}
            whileTap={status === "idle" ? { scale: 0.98 } : {}}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent-teal text-white font-semibold hover:bg-accent-tealLight hover:shadow-lg hover:shadow-accent-teal/25 transition-all duration-300 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Joining..." : "Get Early Access"}
          </motion.button>
        </motion.form>
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
      </div>
    </section>
  );
}
