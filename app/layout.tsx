import type { Metadata } from "next";
import { Inter, Roboto_Mono, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import WelcomePopup from "./components/WelcomePopup";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/Whatsappbutton"; 

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${inter.variable} ${robotoMono.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WelcomePopup />
        <Header />
        {children}
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
