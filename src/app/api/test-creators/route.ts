import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tests')
      .select(`
        creator_id,
        creator_name,
        creator_college,
        created_at
      `)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const creatorMap = new Map();

    data?.forEach((test) => {
      if (!test.creator_id) return;

      const existing = creatorMap.get(test.creator_id);

      if (!existing) {
        creatorMap.set(test.creator_id, {
          creator_id: test.creator_id,
          creator_name: test.creator_name,
          creator_college: test.creator_college,
          total_tests: 1,
          latest_test: test.created_at,
        });
      } else {
        existing.total_tests++;

        if (new Date(test.created_at) > new Date(existing.latest_test)) {
          existing.latest_test = test.created_at;
        }
      }
    });

    return NextResponse.json({
      creators: Array.from(creatorMap.values()),
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}