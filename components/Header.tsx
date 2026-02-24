"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 md:px-6 md:pt-4">
      <div
        className={`mx-auto transition-all duration-300 ${
          scrolled
            ? "max-w-2xl rounded-2xl px-6 py-2.5 backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl"
            : "max-w-7xl px-6"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="#" className="flex-shrink-0" aria-label="PaymentRecovery Home">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="#about"
              className="text-slate-400 hover:text-accent-teal font-medium text-sm transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="#pricing"
              className="text-slate-400 hover:text-accent-teal font-medium text-sm transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-slate-400 hover:text-accent-teal font-medium text-sm transition-colors duration-200"
            >
              FAQ
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link
              href="#cta"
              className="group inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-accent-teal text-white font-semibold text-sm hover:bg-accent-tealLight hover:shadow-lg hover:shadow-accent-teal/25"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={2} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={2} />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-4 overflow-hidden backdrop-blur-xl bg-white/5 rounded-2xl p-4 -mx-2">
              <Link
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-accent-teal font-medium text-sm py-2"
              >
                About
              </Link>
              <Link
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-accent-teal font-medium text-sm py-2"
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-accent-teal font-medium text-sm py-2"
              >
                FAQ
              </Link>
              <Link
                href="#cta"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-accent-teal text-white font-semibold text-sm w-fit hover:bg-accent-tealLight"
              >
                Get Started
              </Link>
            </div>
          )}
      </div>
    </header>
  );
}
