"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const GREETINGS = ["Hello","Bonjour","Hola","こんにちは","مرحبا","你好","Merhaba",
  "Selam","হ্যালো","안녕하세요","नमस्ते"];

export default function hellosplash({
  children,
  step = 300,
  hold = 1000,
}: {
  children: React.ReactNode;
  step?: number;
  hold?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const last = idx >= GREETINGS.length - 1;
    t = setTimeout(() => {
      if (last) setDone(true);
      else setIdx(i => i + 1);
    }, last ? hold : step);
    return () => t && clearTimeout(t);
  }, [idx, step, hold, done]);

  return (
    <div className="relative min-h-screen">
      {/* overlay greetings */}
      {!done && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background text-foreground pointer-events-none">
          <div className="flex items-center gap-3 text-3xl sm:text-4xl font-semibold">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-foreground/70 translate-y-0.5" />
            <span className="animate-[fade_200ms_ease]">{GREETINGS[idx]}</span>
          </div>
        </div>
      )}

      {/* site content slides up when done */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: done ? 0 : "100%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
