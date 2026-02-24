"use client";

export default function Stats() {

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
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(20,184,166,0.06)_0%,transparent_50%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center group p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-accent-teal/20"
            >
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-accent-teal to-accent-tealLight bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-slate-500 mt-3 text-base md:text-lg max-w-xs mx-auto">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
