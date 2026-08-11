import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all available papers including course_type from database catalog
    const { data: papers, error } = await supabase
      .from('papers')
      .select(`
        id,
        college_name,
        program,
        department,
        course_type,
        semester,
        year,
        course_code,
        course_title,
        exam_type,
        uploader_id,
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