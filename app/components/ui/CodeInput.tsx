// components/ui/code-input.tsx
import React from "react";
import { cn } from "../../../lib/utils";

export function CodeInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Enter code..."}
      className={cn(
        "w-full border rounded px-4 py-2 text-black dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
      )}
    />
  );
}
