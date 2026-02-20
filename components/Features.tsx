"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Mail,
  CreditCard,
  BarChart3,
} from "lucide-react";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const features = [
    {
      icon: RefreshCw,
      title: "Smart Retry",
      description:
        "Intelligent retry logic that adapts to card types, failure reasons, and customer behavior. Recover more without annoying your customers.",
    },
    {
      icon: Mail,
      title: "Emails",
      description:
        "Send payment reminder emails with customizable templates with your branding and tone.",
    },
    {
      icon: CreditCard,
      title: "Stripe Connect",
      description:
        "Seamless integration with Stripe. One-click setup, automatic webhook handling, and no code changes required.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      description:
        "See exactly how much revenue you've recovered. Track retry success rates, failed payments, and trends over time.",
    },
  ];

  return (
    <section ref={ref} id="features" className="py-24 px-6 bg-void-900/50 scroll-mt-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(20,184,166,0.04)_0%,transparent_50%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white text-center tracking-[-0.02em] mb-16"
        >
          Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group p-8 rounded-2xl bg-void-800/60 border border-void-600/50 hover:border-accent-teal/30 hover:bg-void-800/80 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-void-700 flex items-center justify-center mb-6 group-hover:bg-accent-teal/10 transition-colors">
                  <Icon
                    className="w-6 h-6 text-accent-teal"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-[-0.02em]">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
