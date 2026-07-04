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

// Add this below your existing POST function!

export async function GET() {
  try {
    // 1. Fetch tests from Supabase and grab the nested question count object correctly
    const { data: tests, error } = await supabaseAdmin
      .from('tests')
      // Note the change here: 'questions(count)' -> 'questions(id)' with head option if using pure RPC, 
      // or standard subquery counting:
      .select(`
        id, 
        title, 
        description, 
        created_at, 
        questions!inner(id)
      `)
      .order('created_at', { ascending: false });

    // Alternative bulletproof route if the join count complains about inner structures:
    // Just grab the ID array length via standard postgrest select:
    const { data: robustTests, error: robustErr } = await supabaseAdmin
      .from('tests')
      .select('id, title, description, created_at, questions(id)')
      .order('created_at', { ascending: false });

    if (robustErr) throw robustErr;

    // 2. Format the data perfectly matching your 'TestSummary' interface
    const formattedTests = robustTests.map((test: any) => ({
      id: test.id,
      title: test.title,
      description: test.description,
      created_at: test.created_at,
      // Safely count how many items exist in the questions array relation
      question_count: Array.isArray(test.questions) ? test.questions.length : 0 
    }));

    return NextResponse.json({ tests: formattedTests });
    
  } catch (err: any) {
    console.error("Fetch error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}