// pages/api/notes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([{ title, content }])
        .select('id, title, content')
        .single(); // ensure exactly one note comes back

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(200).json({ note: data });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('id, title, content');

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(200).json({ notes: data });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}
