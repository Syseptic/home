// app/page.tsx (or wherever your HomePage is)
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

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
    const fetchPublicNotes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content, created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching public notes:", error);
      } else {
        setNotes(data || []);
      }
      setLoading(false);
    };

    fetchPublicNotes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Public Portfolio</h1>

      {loading ? (
        <p>Loading public notes...</p>
      ) : notes.length === 0 ? (
        <p>No public notes yet.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border p-4 rounded hover:shadow transition"
            >
              <Link
                href={`/notes/${note.id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {note.title || "Untitled"}
              </Link>
              <p className="text-gray-600 mt-2 line-clamp-2">
                {note.content}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
