"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-14 px-6 bg-void-950 border-t border-void-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo className="text-white" />
          <nav className="flex items-center gap-8">
            <Link
              href="#features"
              className="text-slate-500 hover:text-accent-teal text-sm font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-slate-500 hover:text-accent-teal text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-slate-500 hover:text-accent-teal text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="p-2 text-slate-500 hover:text-accent-teal transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" strokeWidth={2} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="p-2 text-slate-500 hover:text-accent-teal transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" strokeWidth={2} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="p-2 text-slate-500 hover:text-accent-teal transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" strokeWidth={2} />
            </motion.a>
          </div>
        </div>
        <p className="text-slate-600 text-sm text-center md:text-left mt-10">
          © 2026 PaymentRecovery. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
