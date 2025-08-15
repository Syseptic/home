// app/notes/[id]/page.tsx
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Markdown from "react-markdown";

type Params = { id: string };

export default async function PublicNotePage({ params }: { params: Params }) {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from("notes")
    .select("title, content, is_public, updated_at")
    .eq("id", params.id)
    .single();

  // Only show if it's public
  if (error || !data || !data.is_public) return notFound();

  return (
    <main className="p-6 mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to Public Portfolio
      </Link>

      <h1 className="mt-2 text-3xl font-semibold">
        {data.title || "Untitled"}
      </h1>
      <p className="text-sm text-gray-500">
        Updated {new Date(data.updated_at).toLocaleString()}
      </p>

      {/* Render full content */}
      <article className="prose max-w-none mt-6">
        <Markdown>{data.content ?? ""}</Markdown>
      </article>
    </main>
  );
}
