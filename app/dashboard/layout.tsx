// app/dashboard/layout.tsx
"use client";
import type { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-4 hidden md:block">
        <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">Notes</div>
        <SidebarNotes />
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-blue-600 hover:underline text-sm"
        >
          + New / List
        </Link>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

// Client island to fetch user's notes for the sidebar

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function SidebarNotes() {
  const [items, setItems] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("notes")
        .select("id,title")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(30);
      setItems(data || []);
    })();
  }, []);

  return (
    <ul className="space-y-1">
      {items.map(n => (
        <li key={n.id}>
          <Link
            href={`/dashboard/edit/${n.id}`}
            className="block truncate rounded px-2 py-1 hover:bg-gray-100"
            title={n.title || "Untitled"}
          >
            {n.title || "Untitled"}
          </Link>
        </li>
      ))}
      {items.length === 0 && (
        <li className="text-sm text-gray-500">No notes yet.</li>
      )}
    </ul>
  );
}
