"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          website: formData.website,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to send");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-void-900/50 scroll-mt-20">
      <div className="max-w-xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-2"
        >
          Contact us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="text-slate-500 mb-10"
        >
          Have a question? Send us a message.
        </motion.p>

        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 bg-void-800 border border-void-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 bg-void-800 border border-void-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal"
              placeholder="you@example.com"
            />
          </div>
          <div className="absolute -left-[9999px] w-1 h-1 overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Leave this empty</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              className="w-full px-4 py-3 bg-void-800 border border-void-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-teal/50 focus:border-accent-teal resize-none"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 rounded-xl bg-accent-teal text-white font-semibold hover:bg-accent-tealLight transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Sending..." : "Send message"}
          </button>
          {status === "success" && (
            <p className="text-accent-teal">Thanks. We&apos;ll get back to you soon.</p>
          )}
          {status === "error" && (
            <p className="text-red-400">{errorMessage}</p>
          )}
        </form>
      </div>
    </section>
  );
}
