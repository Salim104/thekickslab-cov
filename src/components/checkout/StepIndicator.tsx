"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckoutStep = 1 | 2 | 3;

const STEPS = [
  { id: 1, label: "Cart" },
  { id: 2, label: "Shipping" },
  { id: 3, label: "Payment" },
] as const;

// "1 Cart → 2 Shipping → 3 Payment" progress bar. Completed steps show a check,
// the current step is filled red, future steps are muted.
export default function StepIndicator({ current }: { current: CheckoutStep }) {
  return (
    <ol className="mx-auto mb-10 flex max-w-xl items-center">
      {STEPS.map((step, i) => {
        const isDone = step.id < current;
        const isCurrent = step.id === current;
        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  isDone && "bg-red-600 text-white",
                  isCurrent && "bg-black text-white",
                  !isDone && !isCurrent && "bg-gray-200 text-gray-500"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : step.id}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isCurrent ? "text-black" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  "mx-3 h-px flex-1 transition-colors",
                  step.id < current ? "bg-red-600" : "bg-gray-200"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
