import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await context.params;

    // 1. Fetch Test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('title')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // 2. Fetch Questions
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, question_text, options, correct_answers')
      .eq('test_id', testId);

    if (qError) {
      return NextResponse.json({ error: "Failed to load questions" }, { status: 500 });
    }

    // 3. Format data to match the Frontend's expectation
    const formatted = questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answers?.[0] || ""
    }));

    return NextResponse.json({ title: test.title, questions: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}