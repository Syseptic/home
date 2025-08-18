// app/components/AnimatedGradientBg.tsx
"use client";

import { cn } from "@/lib/utils";

export function AnimatedGradientBg({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 animate-gradient",
        "dark:hidden", // hides when dark mode is active
        className
      )}
    />
  );
}
