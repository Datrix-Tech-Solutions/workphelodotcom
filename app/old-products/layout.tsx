import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/organisms/Navbar";
import { Toaster } from "@/landing/components/ui/sonner";
import "@/landing/landing.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Workphelo ERP — One Platform. One Login. Complete Business Visibility.",
  description:
    "Workphelo unifies HR, Marketing, Sales, Accounting, Operations, Fleet Management, and Executive Reporting into one intelligent platform built for African businesses. Join the waitlist.",
};

// Old products: the landing page exactly as imported. Kept frozen for comparison with /products.
export default function OldProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className={`${geistSans.variable} ${geistMono.variable} wp-landing`}>
        {children}
        <Toaster position="top-center" richColors />
      </div>
    </>
  );
}
