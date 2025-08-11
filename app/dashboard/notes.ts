// import { NextApiRequest, NextApiResponse } from 'next';
// import { supabase } from '../../lib/supabaseClient';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { user } = await supabase.auth.api.getUserByCookie(req);

//   if (!user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   if (req.method === 'GET') {
//     // Fetch all notes for the user
//     const { data, error } = await supabase
//       .from('notes')
//       .select('*')
//       .eq('user_id', user.id);

//     if (error) {
//       return res.status(500).json({ message: error.message });
//     }

//     return res.status(200).json(data);
//   } else if (req.method === 'POST') {
//     // Create a new note
//     const { title, content } = req.body;

//     const { data, error } = await supabase
//       .from('notes')
//       .insert([{ title, content, user_id: user.id }])
//       .single();
//     if (error) {
//       return res.status(500).json({ message: error.message });
//     }   
//     return res.status(201).json(data);
//   } else {
//     // Method not allowed
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }
