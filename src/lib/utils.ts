import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ZAR prices render as R1799.99 — no space after the R.
export function formatZAR(amount: number) {
  return `R${amount.toFixed(2)}`
}
