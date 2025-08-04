"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Error {
  message: string;
}

export default function ErrorPopup() {
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setErrors((prev) => [...prev, { message: event.message }]);
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  const dismiss = (index: number) => {
    setErrors((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {errors.map((error, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 p-4 rounded-xl shadow-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 mt-1" />
            <div className="flex-1 text-sm">{error.message}</div>
            <button
              className="text-xs font-bold ml-2"
              onClick={() => dismiss(index)}
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
