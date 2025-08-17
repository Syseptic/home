// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Github, Linkedin, Mail  } from "lucide-react";
import AppDock from "@/components/magicui/appdock";

interface PublicNote {
  id: string;
  title: string;
  content: string;
  created_at: string;
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
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-3xl px-6 pb-16 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Your Name. Built with Next.js, Supabase, and shadcn/ui.
      </footer>
      <AppDock />
    </div>
  );
}
