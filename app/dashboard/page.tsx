'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  content: string;
  is_public: boolean; // added
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch notes for the logged-in user
  async function fetchNotes() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    setSession({ user });

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    } else {
      setNotes(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add a note
  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user logged in');
      return;
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding note', error);
    } else {
      setNotes((prev) => [data as Note, ...prev]);
      setTitle('');
      setContent('');
    }
  };

  // Toggle public/private
  const togglePublic = async (noteId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('notes')
      .update({ is_public: !currentValue })
      .eq('id', noteId);

    if (error) {
      console.error('Error toggling public status:', error);
      return;
    }

    // Update locally for instant UI change
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, is_public: !currentValue } : n
      )
    );
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
          <li key={note.id} className="border p-2 mb-2">
            <h2 className="font-bold">{note.title}</h2>
            <p>{note.content}</p>

            {/* Public toggle button */}
            <button
              onClick={() => togglePublic(note.id, note.is_public)}
              className={`px-2 py-1 rounded text-white mr-2 ${
                note.is_public ? 'bg-green-600' : 'bg-gray-500'
              }`}
            >
              {note.is_public ? 'Public' : 'Private'}
            </button>

            <Link href={`/dashboard/edit/${note.id}`}>
              <button className="px-2 py-1 bg-blue-500 text-white rounded">
                Edit
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
