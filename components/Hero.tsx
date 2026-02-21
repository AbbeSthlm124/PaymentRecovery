"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 px-6 overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 bg-mesh-gradient pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
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
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-white leading-[1.1] max-w-5xl mx-auto"
        >
          Stop Losing Revenue to{" "}
          <span className="bg-gradient-to-r from-accent-teal via-accent-tealLight to-accent-teal bg-clip-text text-transparent">
            Failed Payments
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          Automatically recover failed subscription payments with smart retry logic.
          Reclaim up to 35% of otherwise lost revenue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-8 text-slate-500"
        >
          <Check className="w-5 h-5 text-accent-teal flex-shrink-0" strokeWidth={2.5} />
          <span className="text-sm md:text-base">Join 50+ SaaS founders already on the waitlist</span>
        </motion.div>
      </div>
    </section>
  );
}
