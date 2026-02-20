"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-void-900/90 backdrop-blur-xl border-b border-void-600/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="#" className="flex-shrink-0" aria-label="PaymentRecovery Home">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="#features"
              className="text-slate-400 hover:text-accent-teal font-medium text-base transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-slate-400 hover:text-accent-teal font-medium text-base transition-colors duration-200"
            >
              About
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link
              href="#cta"
              className="group inline-flex items-center justify-center px-8 py-3 rounded-full bg-accent-teal text-white font-semibold text-base transition-all duration-300 hover:bg-accent-tealLight hover:shadow-lg hover:shadow-accent-teal/25"
            >
              Get Early Access
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

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-void-600 flex flex-col gap-4 overflow-hidden"
            >
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-accent-teal font-medium text-base py-2"
              >
                Features
              </Link>
              <Link
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-accent-teal font-medium text-base py-2"
              >
                About
              </Link>
              <Link
                href="#cta"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-accent-teal text-white font-semibold text-base w-fit hover:bg-accent-tealLight"
              >
                Get Early Access
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
