"use client";

import React, { useEffect, useRef, useState } from "react";

// Module-scoped flag: persists across client-side navigations in this tab.
let HAS_SHOWN_SPLASH = false;

const GREETINGS = [
  "Hello", "Hola", "Bonjour", "Ciao", "Hallo",
  "こんにちは", "안녕하세요", "नमस्ते",
];

type Props = {
  children: React.ReactNode;
  step?: number;  // ms between greetings
  hold?: number;  // ms to hold the last greeting
  bigger?: boolean; // slightly larger UI
};

export default function HelloSplashOnce({
  children,
  step = 400,
  hold = 900,
  bigger = true,
}: Props) {
  // Decide once on mount whether to show
  const decided = useRef(false);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    // only run once per mount
    if (decided.current) return;
    decided.current = true;

    if (!HAS_SHOWN_SPLASH) {
      setVisible(true);
      HAS_SHOWN_SPLASH = true; // next visits (client-side) won't show splash
    }
  }, []);

  // Cycle greetings while visible
  useEffect(() => {
    if (!visible || exiting) return;

    if (idx < GREETINGS.length - 1) {
      const t = setTimeout(() => setIdx((i) => i + 1), step);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setExiting(true);
        // match CSS transition below (700ms), then unmount overlay
        const hide = setTimeout(() => setVisible(false), 720);
        return () => clearTimeout(hide);
      }, hold);
      return () => clearTimeout(t);
    }
  }, [visible, exiting, idx, step, hold]);

  return (
    <div className="relative min-h-screen">
      {children}

      {visible && (
        <div
          className={[
            "fixed inset-0 z-50 grid place-items-center",
            "bg-background text-foreground",
            "transition-transform duration-700 ease-in-out",
            exiting ? "-translate-y-full" : "translate-y-0",
          ].join(" ")}
        >
          <div className="flex items-center gap-4">
            {/* white bullet, slightly bigger if desired */}
            <span
              className={[
                "inline-block rounded-full bg-white translate-y-0.5",
                bigger ? "h-4 w-4" : "h-3 w-3",
              ].join(" ")}
            />
            <span
              className={[
                "font-semibold tracking-tight",
                bigger ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl",
              ].join(" ")}
            >
              {GREETINGS[idx]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
