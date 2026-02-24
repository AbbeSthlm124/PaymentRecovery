"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-14 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo className="text-white" />
          <nav className="flex items-center gap-8">
            <Link
              href="#about"
              className="text-slate-500 hover:text-accent-teal text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="#pricing"
              className="text-slate-500 hover:text-accent-teal text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-slate-500 hover:text-accent-teal text-sm font-medium transition-colors"
            >
              FAQ
            </Link>
            <a
              href="mailto:contact@paymentrecovery.io"
              className="text-slate-500 hover:text-accent-teal text-sm font-medium transition-colors"
            >
              contact@paymentrecovery.io
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/PaymentR95199"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-accent-teal"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-5 h-5" strokeWidth={2} />
            </a>
          </div>
        </div>
        <p className="text-slate-600 text-sm text-center md:text-left mt-10">
          © 2026 PaymentRecovery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
