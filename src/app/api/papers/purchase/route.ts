import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { paperId } = await req.json();
    if (!paperId) {
      return NextResponse.json({ error: 'Missing Target Paper Identification ID' }, { status: 400 });
    }

    // Invoke your transactional Postgres RPC balance splitter function
    const { data, error: rpcError } = await supabase.rpc('purchase_paper_with_wallet', {
      target_paper_id: paperId,
    });

    if (rpcError) {
      // Catch custom exceptions raised inside PostgreSQL (e.g., 'Insufficient wallet balance')
      return NextResponse.json({ error: rpcError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, unlocked: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}