"use client";

import { Zap, FileText, LayoutDashboard, Mail } from "lucide-react";

export default function Features() {

  const features = [
    {
      icon: Zap,
      title: "Smart retry engine",
      description:
        "Multiple attempts at optimal times. Adjusts based on failure reason and country.",
    },
    {
      icon: FileText,
      title: "Why-log",
      description:
        'See exactly what happens: "Retry #2 scheduled: insufficient_funds in US → waiting for payday window"',
    },
    {
      icon: LayoutDashboard,
      title: "One-page dashboard",
      description:
        "Recovered $ · Recovery rate % · Next retry · Why – all in one place.",
    },
    {
      icon: Mail,
      title: "Simple email alerts",
      description:
        "We tell you when we recover a customer. No noise, just the updates that matter.",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 scroll-mt-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(20,184,166,0.04)_0%,transparent_50%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-[-0.02em] mb-16">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-accent-teal/30 hover:bg-white/[0.07]"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-teal/10 flex items-center justify-center mb-6 group-hover:bg-accent-teal/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent-teal" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-[-0.02em]">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
