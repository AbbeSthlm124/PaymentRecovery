"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const stats = [
    {
      value: "35%",
      label: "of failed payments recovered on average",
    },
    {
      value: "9%",
      label: "MRR recovered for typical SaaS",
    },
    {
      value: "$9,880",
      label: "average monthly savings per customer",
    },
  ];

  return (
    <section ref={ref} className="py-24 px-6 bg-void-900/50 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(20,184,166,0.06)_0%,transparent_50%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center group"
            >
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-accent-teal to-accent-tealLight bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </p>
              <p className="text-slate-500 mt-3 text-base md:text-lg max-w-xs mx-auto">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
