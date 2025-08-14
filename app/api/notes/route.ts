import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // Check the authenticated user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ message: userError.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Fetch only notes for this user
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}


export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // auth
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('Auth error:', userError);
    return NextResponse.json({ note: null, error: userError.message }, { status: 500 });
  }
  if (!user) {
    console.error('No user');
    return NextResponse.json({ note: null, error: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await req.json();

  // Insert and request fields explicitly. .select() will return an array.
  const insertRes = await supabase
    .from('notes')
    .insert([{ title, content, user_id: user.id }])
    .select('id, title, content');

  // log the full supabase response (data, error, status)
  console.log('Supabase insertRes:', JSON.stringify(insertRes, null, 2));

  const { data, error } = insertRes;

  if (error) {
    // return error details so client can show them; avoid hiding useful info
    return NextResponse.json(
      { note: null, error: error.message, details: error.details ?? null },
      { status: 500 }
    );
  }

  // data may be an array (because .select() after insert returns array), pick first item
  const note = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({ note });
}

