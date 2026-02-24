"use client";

import { Link2, RefreshCw, Eye, Users } from "lucide-react";

export default function HowItWorks() {

  const steps = [
    {
      icon: Link2,
      title: "Connect Stripe",
      description: "One-click integration. We listen for failed payments.",
    },
    {
      icon: RefreshCw,
      title: "We retry intelligently",
      description: "Multiple attempts with smart timing based on failure reason and customer location.",
    },
    {
      icon: Eye,
      title: "You see exactly why",
      description: "We show you the reason behind every failed payment and retry strategy.",
    },
    {
      icon: Users,
      title: "You keep customers",
      description: "When payment succeeds, subscription continues. No manual work.",
    },
  ];

  return (
    <section id="about" className="py-24 px-6 bg-void-950/50 scroll-mt-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-[-0.02em]">
          How it works
        </h2>
        <p className="text-slate-500 text-center mt-4 mb-16 max-w-xl mx-auto">
          Four simple steps to recover your revenue.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="group relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-accent-teal/30 hover:bg-white/[0.07]"
              >
                <span className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center text-sm font-bold text-accent-teal rounded-full backdrop-blur-xl bg-white/5 border border-white/10">
                  {i + 1}
                </span>
                <div className="w-12 h-12 rounded-xl bg-accent-teal/10 flex items-center justify-center mb-6 group-hover:bg-accent-teal/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent-teal" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
