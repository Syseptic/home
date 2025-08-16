"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Params = { id: string };

export default function EditNotePage() {
  const { id } = useParams<Params>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("title, content, is_public")
        .eq("id", id)
        .single();

      if (error) {
        toast.error(error.message || "Failed to load note");
      } else {
        setTitle(data?.title ?? "");
        setContent(data?.content ?? "");
        setIsPublic(Boolean(data?.is_public));
      }
      setLoading(false);
    })();
  }, [id]);

  const saveNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    const { error } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", id);

    setSaving(false);

    if (error) return toast.error(error.message || "Failed to save note");
    toast.success("Note saved");
    router.push("/dashboard");
  };

  const togglePublic = async () => {
    if (!id) return;
    const next = !isPublic;
    setToggling(true);
    setIsPublic(next); // optimistic
    const { error } = await supabase.from("notes").update({ is_public: next }).eq("id", id);
    setToggling(false);

    if (error) {
      setIsPublic(!next);
      return toast.error(error.message || "Failed to update visibility");
    }
    toast.success(next ? "Note is now Public" : "Note set to Private");
  };

  const reallyDeleteNote = async () => {
    if (!id) return;
    setDeleting(true);
    const { error } = await supabase.from("notes").delete().eq("id", id);
    setDeleting(false);

    if (error) return toast.error(error.message || "Failed to delete note");
    toast.success("Note deleted");
    router.push("/dashboard");
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Edit Note</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm">{isPublic ? "Public" : "Private"}</span>
          <Switch checked={isPublic} onCheckedChange={togglePublic} disabled={toggling} />
          {isPublic && (
            <Button variant="outline" asChild>
              <a href={`/notes/${id}`} target="_blank" rel="noreferrer">View public page</a>
            </Button>
          )}
        </div>
      </div>

      <form className="space-y-4" onSubmit={saveNote}>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Write your note…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px]"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="space-x-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={reallyDeleteNote} disabled={deleting}>
                  {deleting ? "Deleting…" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  );
}
