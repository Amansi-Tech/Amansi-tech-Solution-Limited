"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Avoid duplication from hydration mismatch
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <a
      href="https://wa.me/08023101101"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[5rem] left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
