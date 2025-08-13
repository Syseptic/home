// pages/api/notes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { title, content } = req.body;

    const { data, error } = await supabase
      .from('notes')
      .insert([{ title, content }])
      .select('*') // Return inserted row
      .single();   // Since we're only adding one

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json(data);
  }

  res.status(405).json({ message: 'Method not allowed' });
}
