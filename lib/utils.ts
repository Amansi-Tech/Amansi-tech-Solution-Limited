// lib/utils.ts

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge"; // ✅ Correct import

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
