'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Check if user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = '/login';
      } else {
        setSession(data.session);
      }
      setLoading(false);
    });
  }, []);

  // Load notes once session is ready
  useEffect(() => {
    if (session) {
      fetch('/api/notes', { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          // ✅ Make sure we only keep valid notes with title + content
          const validNotes = Array.isArray(data)
            ? data.filter(
                (n) =>
                  n &&
                  typeof n.id === 'string' &&
                  typeof n.title === 'string' &&
                  typeof n.content === 'string'
              )
            : [];
          setNotes(validNotes);
        });
    }
  }, [session]);

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) return;

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // send auth cookie
      body: JSON.stringify({ title, content }),
    });

    const newNote = await res.json();

    if (res.ok && newNote && newNote.title && newNote.content) {
      setNotes((prev) => [...prev, newNote]);
      setTitle('');
      setContent('');
    } else {
      console.error(newNote?.message || 'Error adding note');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Private Dashboard</h1>
      <p>Welcome, {session?.user?.email}</p>

      <div className="mt-4">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
      </div>

      <ul className="mt-4">
        {notes.map((note) => (
          // ✅ Only render if both title + content exist
          note?.title && note?.content && (
            <li key={note.id} className="border p-2 mb-2">
              <h2 className="font-bold">{note.title}</h2>
              <p>{note.content}</p>
            </li>
          )
        ))}
      </ul>
    </div>
  );
}
