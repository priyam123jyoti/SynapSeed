import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15 dynamic params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Creator ID is required.' },
        { status: 400 }
      );
    }

    // Fetch all published tests by this creator
    const { data: tests, error } = await supabaseAdmin
      .from('tests')
      .select(`
        id,
        title,
        description,
        status,
        created_at,
        creator_id,
        creator_name,
        creator_college
      `)
      .eq('creator_id', id)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!tests || tests.length === 0) {
      return NextResponse.json({
        creator: null,
        tests: [],
      });
    }

    return NextResponse.json({
      creator: {
        creator_id: tests[0].creator_id,
        creator_name: tests[0].creator_name,
        creator_college: tests[0].creator_college,
      },
      tests,
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}