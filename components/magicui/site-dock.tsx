"use client";

import Link from "next/link";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { Github, Linkedin, Mail, NotebookPen, Home } from "lucide-react";

export default function SiteDock() {
  return (
    // fixed, centered, and click-through safe
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <Dock
        className="pointer-events-auto"
        iconSize={40}
        iconMagnification={64}
        iconDistance={140}
        direction="bottom"
      >
        {/* One icon per DockIcon */}
        <Link href="/" aria-label="Home" title="Home">
          <DockIcon className="rounded-xl bg-muted/30 hover:bg-muted">
            <Home className="h-1/2 w-1/2" />
          </DockIcon>
        </Link>

        <a
          href="mailto:you@example.com" /* ← update this */
          aria-label="Email"
          title="Email"
        >
          <DockIcon className="rounded-xl bg-muted/30 hover:bg-muted">
            <Mail className="h-1/2 w-1/2" />
          </DockIcon>
        </a>

        <a
          href="https://github.com/yourname" /* ← update this */
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <DockIcon className="rounded-xl bg-muted/30 hover:bg-muted">
            <Github className="h-1/2 w-1/2" />
          </DockIcon>
        </a>

        <a
          href="https://www.linkedin.com/in/yourname" /* ← update this */
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <DockIcon className="rounded-xl bg-muted/30 hover:bg-muted">
            <Linkedin className="h-1/2 w-1/2" />
          </DockIcon>
        </a>

        <Link href="/notes" aria-label="Notes" title="Notes">
          <DockIcon className="rounded-xl bg-muted/30 hover:bg-muted">
            <NotebookPen className="h-1/2 w-1/2" />
          </DockIcon>
        </Link>
      </Dock>
    </div>
  );
}
