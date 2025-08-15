"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Params = { id: string };

type Toast = {
  id: number;
  message: string;
  variant?: "success" | "error" | "info";
};

export default function EditNotePage() {
  const { id } = useParams<Params>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);
  const pushToast = (message: string, variant: Toast["variant"] = "info") => {
    const idNum = toastId.current++;
    setToasts((t) => [...t, { id: idNum, message, variant }]);
    // Auto-dismiss after 2.5s
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== idNum));
    }, 2500);
  };

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch note
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      setErrMsg(null);
      setLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("title, content")
        .eq("id", id)
        .single();

      if (cancelled) return;

      if (error) setErrMsg(error.message ?? "Failed to load note.");
      else {
        setTitle(data?.title ?? "");
        setContent(data?.content ?? "");
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Save
  const saveNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return setErrMsg("Missing note id.");
    setSaving(true);
    setErrMsg(null);

    const { error } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setErrMsg(error.message ?? "Failed to save note.");
      pushToast("Failed to save note.", "error");
      return;
    }
    pushToast("Note saved", "success");
    router.push("/dashboard");
  };

  // Delete (triggered after confirm)
  const reallyDeleteNote = async () => {
    if (!id) return setErrMsg("Missing note id.");
    setDeleting(true);
    setErrMsg(null);
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      pushToast("Note deleted", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setErrMsg(err?.message ?? "Failed to delete note.");
      pushToast("Failed to delete note", "error");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto relative">
      <h1 className="text-xl font-bold mb-4">Edit Note</h1>

      {errMsg && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-2 text-red-700">
          {errMsg}
        </div>
      )}

      <form className="space-y-4" onSubmit={saveNote}>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <textarea
          className="w-full p-2 border rounded h-64"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note…"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60"
            title="Delete this note"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </form>

      {/* Toasts */}
      <div className="fixed right-4 bottom-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              "rounded px-4 py-2 shadow text-white",
              t.variant === "success" && "bg-green-600",
              t.variant === "error" && "bg-red-600",
              (!t.variant || t.variant === "info") && "bg-gray-900",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmOpen && (
        <ConfirmDialog
          title="Delete this note?"
          description="This action cannot be undone."
          confirmLabel={deleting ? "Deleting…" : "Delete"}
          cancelLabel="Cancel"
          onConfirm={reallyDeleteNote}
          onCancel={() => setConfirmOpen(false)}
          disabled={deleting}
        />
      )}
    </div>
  );
}

/** Accessible, dependency-free modal */
function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  disabled,
}: {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  // Focus the dialog for screen readers
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      onClick={onCancel}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="w-full max-w-md rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h2 id="confirm-title" className="text-lg font-semibold">
            {title}
          </h2>
          {description && (
            <p id="confirm-desc" className="mt-2 text-gray-600">
              {description}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white"
              disabled={disabled}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-60"
              disabled={disabled}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
