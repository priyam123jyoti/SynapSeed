import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { title, description, questions } = await req.json();

    // Begin standard ACID transaction lifecycle simulation via individual row writes
    const { data: testData, error: testErr } = await supabaseAdmin
      .from('tests')
      .insert([{ title, description, status: 'PUBLISHED' }])
      .select()
      .single();

    if (testErr) throw testErr;

    const formattedQuestionsPayload = questions.map((q: any) => ({
      test_id: testData.id,
      type: q.type,
      question_text: q.question_text,
      options: q.options,
      correct_answers: q.correct_answers
    }));

    const { error: questionsErr } = await supabaseAdmin
      .from('questions')
      .insert(formattedQuestionsPayload);

    if (questionsErr) throw questionsErr;

    return NextResponse.json({ success: true, testId: testData.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}