"use client";

import Link from "next/link";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 scroll-mt-20 relative">
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em]">
          Simple, transparent pricing
        </h2>
        <p className="text-slate-500 mt-4 mb-12">
          Launch pricing coming soon. Join the waitlist for early access and 50% off your first year.
        </p>
        <div>
          <Link
            href="#cta"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-accent-teal text-white font-semibold hover:bg-accent-tealLight hover:shadow-lg hover:shadow-accent-teal/25 transition-all duration-300"
          >
            Get early access
          </Link>
        </div>
      </div>
    </section>
  );
}
