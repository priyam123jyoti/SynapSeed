import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Fetch the specific test AND its related questions in one query
    const { data: test, error } = await supabaseAdmin
      .from('tests')
      .select(`
        id, 
        title, 
        description, 
        created_at, 
        questions(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!test) throw new Error('Test not found');

    // 2. Send the test data back to the frontend
    return NextResponse.json({ test });
    
  } catch (err: any) {
    console.error("Fetch error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}