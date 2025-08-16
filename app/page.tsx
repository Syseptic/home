// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, ArrowUpRight, Github, Linkedin, Mail, MoonStar, PencilLine  } from "lucide-react";

import { Dock, DockIcon, DockSeparator } from "@/components/magicui/dock";

interface PublicNote {
  id: string;
  title: string;
  content: string;
  created_at: string;
}


export function AppDock() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6">
      <Dock
        iconSize={48}
        iconMagnification={96}  // nice “pop”
        iconDistance={240}      // wider neighbor influence
        direction="bottom"
        className="w-max rounded-2xl border border-white/10 backdrop-blur-md
                   supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10"
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

        <a href="https://github.com/yourname" target="_blank" rel="noreferrer" aria-label="GitHub">
          <DockIcon className="rounded-full hover:bg-white/10 transition-colors">
            <Github className="h-6 w-6" strokeWidth={1.5} />
          </DockIcon>
        </a>

        <a href="https://www.linkedin.com/in/yourname" target="_blank" rel="noreferrer" aria-label="LinkedIn">
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
  );
}


export default function HomePage() {
  const [notes, setNotes] = useState<PublicNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (!error) setNotes(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="mx-auto max-w-3xl px-6 pt-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Shreyaj Yadav
        </h1>
        <p className="mt-3 text-balance text-muted-foreground">
          Short one-liner about what you do. Keep it crisp.  
          Building things with Next.js, Supabase, and shadcn/ui.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="mailto:you@example.com">
              <Mail className="mr-2 h-4 w-4" /> Contact
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="https://github.com/yourname" target="_blank" rel="noreferrer">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="https://www.linkedin.com/in/yourname" target="_blank" rel="noreferrer">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </a>
          </Button>
        </div>
      </header>

      {/* Divider */}
      <div className="mx-auto mt-12 max-w-3xl px-6">
        <Separator />
      </div>

      {/* Notes section (center of page) */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-medium">Notes</h2>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            All notes <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No public notes yet.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li key={note.id}>
                <Link href={`/notes/${note.id}`}>
                  <Card className="transition hover:bg-muted/40">
                    <CardContent className="p-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="line-clamp-1 text-base font-semibold">
                          {note.title || "Untitled"}
                        </h3>
                        <time
                          dateTime={note.created_at}
                          className="shrink-0 text-xs text-muted-foreground"
                        >
                          {new Date(note.created_at).toLocaleDateString()}
                        </time>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-3xl px-6 pb-16 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Your Name. Built with Next.js, Supabase, and shadcn/ui.
      </footer>
      <AppDock />
    </div>
  );
}
