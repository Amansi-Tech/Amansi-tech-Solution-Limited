// components/ui/submit-button.tsx
import React from "react";
import { cn } from "../../../lib/utils";

export function SubmitButton({ label = "Submit", onClick, className }: {
  label?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 w-full transition",
        className
      )}
    >
      {label}
    </button>
  );
}
