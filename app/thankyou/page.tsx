"use client";

import { CheckCircle, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: "url('/bg-3.jpg')", 
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 sm:p-10 max-w-md w-full text-center backdrop-blur"
      >
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-violet-700 mb-2">Thank You!</h1>
        <p className="text-gray-700 text-sm sm:text-base mb-6">
          Your message has been successfully sent. We’ll get back to you shortly.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
