"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      number: 1,
      title: "Detect",
      description:
        "We integrate with your payment processor to automatically identify failed payment attempts as they happen.",
    },
    {
      number: 2,
      title: "Retry",
      description:
        "Our smart retry logic attempts to recover the payment at optimal times, avoiding customer frustration.",
    },
    {
      number: 3,
      title: "Recover",
      description:
        "Track recovered revenue in real-time. Send emails to customers. Restore subscriptions automatically.",
    },
  ];

  return (
    <section ref={ref} id="about" className="py-24 px-6 bg-void-950 scroll-mt-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white text-center tracking-[-0.02em]"
        >
          How it works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-slate-500 text-center mt-4 mb-16 max-w-xl mx-auto"
        >
          Three steps to turn failed payments back into revenue.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-col items-center md:items-start text-center md:text-left group"
            >
              <div className="w-14 h-14 rounded-2xl bg-void-800 border border-void-600 flex items-center justify-center mb-6 group-hover:border-accent-teal/50 group-hover:bg-accent-teal/5 transition-all duration-300">
                <span className="text-xl font-bold text-accent-teal">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
