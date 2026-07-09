//src/app/api/papers/catalog-list/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// FORCE NEXT.JS TO BYPASS VERCEL CACHING FOR REAL-TIME UPDATES
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all available papers from your database catalog
    const { data: papers, error } = await supabase
      .from('papers')
      .select(`
  id,
  college_name,
  program,
  department,
  semester,
  year,
  course_code,
  course_title,
  exam_type,
  created_at
`)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(papers || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}