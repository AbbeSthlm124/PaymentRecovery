"use client";

const faqs = [
  {
    q: "What payment processors do you support?",
    a: "We currently support Stripe. One-click integration – we listen for failed payments via webhooks.",
  },
  {
    q: "How does the retry logic work?",
    a: "We retry failed payments at optimal times based on the failure reason and customer location. For example, insufficient funds in the US might wait for a typical payday window.",
  },
  {
    q: "Do I need to change my existing Stripe setup?",
    a: "Minimal changes. Connect your Stripe account and we handle the rest. No code changes required.",
  },
  {
    q: "What kind of businesses use PaymentRecovery?",
    a: "Memberships, communities, newsletters, courses – any Stripe subscription business with recurring revenue. We help you recover failed payments automatically.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 px-6 scroll-mt-20 relative">
      <div className="relative max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center tracking-[-0.02em] mb-12">
          FAQ
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
            >
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
