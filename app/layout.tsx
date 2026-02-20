import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PaymentRecovery - Stop Losing Revenue to Failed Payments",
  description:
    "Recover failed payments automatically. Smart retry logic, customizable emails, and real-time dashboard for SaaS founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-inter bg-[#070b10] text-white min-h-screen">{children}</body>
    </html>
  );
}
