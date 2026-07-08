import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized login required' }, { status: 401 });
    }

    const { paperId } = await request.json();
    if (!paperId) {
      return NextResponse.json({ error: 'Missing paper identifier parameter' }, { status: 400 });
    }

    // Call our atomic postgres transaction function
    const { data, error } = await supabase.rpc('purchase_paper', {
      p_buyer_id: user.id,
      p_paper_id: paperId
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, meta: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}