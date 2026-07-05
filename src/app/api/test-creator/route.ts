//src/app/api/student-feed/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Fetch all published tests
    const { data: tests, error: testErr } = await supabaseAdmin
      .from('tests')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (testErr) throw testErr;

    // 2. Fetch submissions
    // Note: In a full app, you would filter by the logged-in student's ID.
    // For now, we fetch the latest submissions to populate your dashboard metrics.
    const { data: submissions, error: subErr } = await supabaseAdmin
      .from('test_submissions')
      .select('test_id, score, total_questions');

    if (subErr) throw subErr;

    // 3. Map submissions onto their respective tests
    const payload = tests.map(test => {
      const studentSubmission = submissions?.find(sub => sub.test_id === test.id);
      return {
        ...test,
        submission: studentSubmission || null
      };
    });

    return NextResponse.json({ payload });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}