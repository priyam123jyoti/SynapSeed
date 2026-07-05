//src/app/api/tests/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Next.js 15 Async parameter promise handling rule
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Safely unpack asynchronous dynamic parameters
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Missing active matrix node ID.' }, { status: 400 });
    }

    // Query specific single assessment along with its inner question tree nodes
    const { data: test, error } = await supabaseAdmin
      .from('tests')
      .select(`
        id, 
        title, 
        description, 
        created_at,
        creator_name,
        creator_college,
        questions(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!test) return NextResponse.json({ error: 'Assessment matrix not found' }, { status: 404 });

    return NextResponse.json({ test });
    
  } catch (err: any) {
    console.error("Individual evaluation link capture error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}