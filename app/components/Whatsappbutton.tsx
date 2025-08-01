"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Prevent double rendering on hydration
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <a
      href="https://wa.me/+2348023101101"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 left-4  z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform  "
    >
      <Phone className="w-6 h-6 text-white" />
    </a>
  );
}
