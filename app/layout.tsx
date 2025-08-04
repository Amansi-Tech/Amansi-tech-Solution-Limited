// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Roboto_Mono, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import WelcomePopup from "./components/WelcomePopup";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/Whatsappbutton";
import ErrorPopup from "./components/ErrorPopup"; // ✅ Add this for toast-like error popups

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amansi Tech",
  description: "Your trusted tech partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${robotoMono.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-900 text-black dark:text-white`}
      >
        <WelcomePopup />
        <Header />
        <main className="px-4 sm:px-6 md:px-10 py-6">{children}</main>
        <WhatsAppButton />
        <Footer />
        <ErrorPopup /> {/* 👈 Mount error card UI at root level */}
      </body>
    </html>
  );
}
