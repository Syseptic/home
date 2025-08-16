'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner'; import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  content: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [creating, setCreating] = useState(false);

  async function fetchNotes() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setSession({ user });

    const { data, error } = await supabase
      .from('notes')
      .select('id,title,content,is_public,created_at,updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

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

  const handleAddNote = async () => {
    if (!title.trim() || !content.trim()) return;
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content, user_id: user.id }])
      .select('id,title,content,is_public,created_at,updated_at')
      .single();

    setCreating(false);

    if (error) {
      console.error('Error adding note', error);
      toast.error('Failed to add note');
      return;
    }

    setNotes((prev) => [data as Note, ...prev]);
    setTitle('');
    setContent('');
    toast.success('Note created');
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 md:grid-cols-[280px_1fr]">
      {/* <Toaster richColors closeButton /> */}
      {/* Sidebar */}
      <aside className="border-r">
        <div className="p-4">
          <Card className="bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Notes</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-3">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-6 w-3/5" />
                </div>
              ) : notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              ) : (
                <ScrollArea className="h-[65vh] pr-2">
                  <ul className="space-y-1">
                    {notes.map((n) => (
                      <li key={n.id}>
                        <Link
                          href={`/dashboard/edit/${n.id}`}
                          className="block rounded px-2 py-1 hover:bg-muted"
                          title={n.title || 'Untitled'}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm">
                              {n.title || 'Untitled'}
                            </span>
                            {n.is_public && (
                              <Badge variant="secondary" className="shrink-0">
                                Public
                              </Badge>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main */}
      <main className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Private Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome Shreyaj.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">View Public Portfolio</Button>
          </Link>
        </div>

        {/* Create new note */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Create a new note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm text-muted-foreground">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Weekly plan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="content" className="text-sm text-muted-foreground">
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your note…"
                  className="min-h-[140px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleAddNote} disabled={creating}>
                {creating ? 'Creating…' : 'Add Note'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setTitle('');
                  setContent('');
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes list (cards) */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </>
          ) : notes.length === 0 ? (
            <Card className="sm:col-span-2 lg:col-span-3">
              <CardContent className="py-10 text-center text-muted-foreground">
                No notes yet — create your first note above.
              </CardContent>
            </Card>
          ) : (
            notes.map((n) => (
              <Card key={n.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base">
                    {n.title || 'Untitled'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="line-clamp-3 text-sm text-muted-foreground whitespace-pre-wrap">
                    {n.content}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <Link href={`/dashboard/edit/${n.id}`}>
                      <Button size="sm">Edit</Button>
                    </Link>
                    {n.is_public ? (
                      <Badge variant="secondary">Public</Badge>
                    ) : (
                      <Badge variant="outline">Private</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
