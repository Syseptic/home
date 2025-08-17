"use client";

import Link from "next/link";
import { Dock, DockIcon, DockSeparator } from "@/components/magicui/dock";
import { Home, PencilLine, Github, Linkedin, Mail, MoonStar } from "lucide-react";

export default function AppDock() {
  return (
    <div
      className="
        fixed left-0 right-0 bottom-0 z-50 flex justify-center
        pb-[calc(env(safe-area-inset-bottom)+12px)]
      "
    >
      {/* Mobile dock (compact, no hover animation on touch) */}
      <div className="flex sm:hidden">
        <Dock
          iconSize={36}
          iconDistance={160}
          direction="bottom"
          className="
            pointer-events-auto
            w-max rounded-2xl border border-white/10 backdrop-blur-md
            supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10
          "
        >
          <Link href="/" aria-label="Home" title="Home">
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <Home className="h-5 w-5" strokeWidth={1.5} />
            </DockIcon>
          </Link>

          <Link href="/notes" aria-label="Notes" title="Notes">
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <PencilLine className="h-5 w-5" strokeWidth={1.5} />
            </DockIcon>
          </Link>

          <DockSeparator />

          <a
            href="https://github.com/yourname"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <Github className="h-5 w-5" strokeWidth={1.5} />
            </DockIcon>
          </a>

          <a
            href="https://www.linkedin.com/in/yourname"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <Linkedin className="h-5 w-5" strokeWidth={1.5} />
            </DockIcon>
          </a>

          <a href="mailto:you@example.com" aria-label="Email" title="Email">
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <Mail className="h-5 w-5" strokeWidth={1.5} />
            </DockIcon>
          </a>

          <DockSeparator />

          <button aria-label="Toggle theme" title="Toggle theme" type="button">
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <MoonStar className="h-5 w-5" strokeWidth={1.5} />
            </DockIcon>
          </button>
        </Dock>
      </div>

      {/* Desktop dock (hover spacing animation) */}
      <div className="hidden sm:flex">
        <Dock
          iconSize={48}
          iconDistance={240}
          direction="bottom"
          className="
            pointer-events-auto
            w-max rounded-2xl border border-white/10 backdrop-blur-md
            supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10
          "
        >
          <Link href="/" aria-label="Home" title="Home">
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <Home className="h-6 w-6" strokeWidth={1.5} />
            </DockIcon>
          </Link>

          <Link href="/notes" aria-label="Notes" title="Notes">
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <PencilLine className="h-6 w-6" strokeWidth={1.5} />
            </DockIcon>
          </Link>

          <DockSeparator />

          <a
            href="https://github.com/yourname"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <Github className="h-6 w-6" strokeWidth={1.5} />
            </DockIcon>
          </a>

          <a
            href="https://www.linkedin.com/in/yourname"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <Linkedin className="h-6 w-6" strokeWidth={1.5} />
            </DockIcon>
          </a>

          <a href="mailto:you@example.com" aria-label="Email" title="Email">
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <Mail className="h-6 w-6" strokeWidth={1.5} />
            </DockIcon>
          </a>

          <DockSeparator />

          <button aria-label="Toggle theme" title="Toggle theme" type="button">
            <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
              <MoonStar className="h-6 w-6" strokeWidth={1.5} />
            </DockIcon>
          </button>
        </Dock>
      </div>
    </div>
  );
}
