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

  const { title, content } = await req.json();

  // Insert a note tied to this user
  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, content, user_id: user.id }])
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
