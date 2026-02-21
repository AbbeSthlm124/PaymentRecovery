"use client";

import { motion } from "framer-motion";

export default function CTA() {
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
          className="text-slate-500 text-lg"
        >
          Be first to recover failed payments automatically.
        </motion.p>
      </div>
    </section>
  );
}
