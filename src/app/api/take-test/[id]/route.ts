import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await context.params;

    if (!testId) {
      return NextResponse.json({ error: "Missing required Test ID." }, { status: 400 });
    }

    // 1️⃣ Fetch the Quiz Title
    const { data: test, error: testError } = await supabase
      .from('quizzes')
      .select('title')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: "Could not locate this test." }, { status: 404 });
    }

    // 2️⃣ Fetch all associated questions
    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, question_text, options, correct_answer')
      .eq('quiz_id', testId);

    if (qError) {
      return NextResponse.json({ error: "Failed to load test questions." }, { status: 500 });
    }

    // 3️⃣ Send it all back to the frontend
    return NextResponse.json({
      title: test.title,
      questions: questions || []
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}