"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dock, DockIcon, DockSeparator } from "@/components/magicui/dock";
import { Home, PencilLine, Github, Linkedin, Mail, MoonStar } from "lucide-react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

export default function AppDock() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Desktop vs Mobile sizing
  const iconSize = isMobile ? 36 : 48;
  const iconMagnification = isMobile ? 44 : 96; // gentle on mobile
  const iconDistance = isMobile ? 160 : 240;    // shorter spread on mobile

  return (
    <div
      className="
        fixed left-0 right-0 z-50 flex justify-center
        pb-[calc(env(safe-area-inset-bottom)+12px)]  /* keeps off iOS home bar */
        bottom-0
      "
    >
      <Dock
        iconSize={iconSize}
        iconMagnification={iconMagnification}
        iconDistance={iconDistance}
        direction="bottom"
        className="
          w-max rounded-2xl border border-white/10 backdrop-blur-md
          supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10
        "
      >
        <Link href="/" aria-label="Home" title="Home">
          <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
            <Home className={isMobile ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.5} />
          </DockIcon>
        </Link>

        <Link href="/notes" aria-label="Notes" title="Notes">
          <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
            <PencilLine className={isMobile ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.5} />
          </DockIcon>
        </Link>

        <DockSeparator />

        <a href="https://github.com/yourname" target="_blank" rel="noreferrer" aria-label="GitHub">
          <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
            <Github className={isMobile ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.5} />
          </DockIcon>
        </a>

        <a href="https://www.linkedin.com/in/yourname" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
            <Linkedin className={isMobile ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.5} />
          </DockIcon>
        </a>

        <a href="mailto:you@example.com" aria-label="Email" title="Email">
          <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
            <Mail className={isMobile ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.5} />
          </DockIcon>
        </a>

        <DockSeparator />

        <button aria-label="Toggle theme" title="Toggle theme" type="button">
          <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
            <MoonStar className={isMobile ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.5} />
          </DockIcon>
        </button>
      </Dock>
    </div>
  );
}
