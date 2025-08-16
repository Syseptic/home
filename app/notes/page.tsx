// app/notes/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AppDock from "@/components/magicui/appdock";


type PublicNote = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string;
};

export default function NotesIndexPage() {
  const [notes, setNotes] = useState<PublicNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("id,title,content,created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false });
      if (!error) setNotes(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Notes</h1>
      <p className="text-sm text-muted-foreground">
        Public notes, newest first.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {loading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : notes.length === 0 ? (
          <Card className="sm:col-span-2">
            <CardContent className="py-10 text-center text-muted-foreground">
              Nothing here yet.
            </CardContent>
          </Card>
        ) : (
          notes.map((n) => (
            <Link key={n.id} href={`/notes/${n.id}`}>
              <Card className="transition hover:bg-muted/40">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base">
                    {n.title || "Untitled"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground whitespace-pre-wrap">
                    {n.content}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
      <AppDock />
    </main>
  );
}
