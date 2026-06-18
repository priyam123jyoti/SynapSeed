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

    if (!testId) {
      return NextResponse.json({ error: "Missing test ID." }, { status: 400 });
    }

    // 1. Fetch test title
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('title')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      console.error("Test fetch error:", testError);
      return NextResponse.json({ error: "Test not found." }, { status: 404 });
    }

    // 2. Fetch questions
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, type, question_text, options, correct_answers')
      .eq('test_id', testId);  // uses test_id — matches new schema

    if (qError) {
      console.error("Questions fetch error:", qError);
      return NextResponse.json({ error: "Failed to load questions." }, { status: 500 });
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "No questions found for this test." }, { status: 404 });
    }

    // 3. Format — FIX: include 'type' so frontend knows MCQ vs FITB vs MSQ
    //              FIX: return full 'correct_answers' array, not just first item
    //                   (original had correct_answer: q.correct_answers?.[0] which breaks MSQ)
    const formatted = questions.map(q => ({
      id: q.id,
      type: q.type,                      // was missing — student page needs this
      question_text: q.question_text,
      options: q.options || [],
      correct_answers: q.correct_answers || [],  // full array — was only returning first item
    }));

    return NextResponse.json({
      title: test.title,
      questions: formatted,
    });

  } catch (err: any) {
    console.error("GET test error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error." }, { status: 500 });
  }
}