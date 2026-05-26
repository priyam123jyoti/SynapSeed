import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// FIXED: Defined the context parameter matching Next.js's strict asynchronous Promise type contract
export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> } 
) {
  try {
    // FIXED: Explicitly await the params Promise wrapper to extract the string id safely
    const { id: testId } = await context.params;

    if (!testId) {
      return NextResponse.json({ error: "Missing required Test ID identifier parameter." }, { status: 400 });
    }

    // 1. Fetch overall test info from the persistence ledger
    const { data: test, error: testError } = await supabase
      .from('quizzes') 
      .select('title, questions')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: "Target evaluation document profile not located." }, { status: 404 });
    }

    // 2. Fetch all student submissions recorded for this explicit node entry
    const { data: submissions, error: subError } = await supabase
      .from('quiz_submissions') 
      .select('*')
      .eq('quiz_id', testId)
      .order('submitted_at', { ascending: false });

    if (subError) throw subError;

    // 3. Compute metric evaluation aggregates safely
    const totalSubmissions = submissions ? submissions.length : 0;
    const totalQuestions = Array.isArray(test.questions) ? test.questions.length : 0;
    
    let classAverage = 0;
    let highestScore = 0;

    if (totalSubmissions > 0 && submissions) {
      const sum = submissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
      classAverage = parseFloat((sum / totalSubmissions).toFixed(2));
      highestScore = Math.max(...submissions.map(s => s.score || 0));
    }

    return NextResponse.json({
      testTitle: test.title,
      totalQuestions,
      metrics: {
        totalSubmissions,
        classAverage,
        highestScore
      },
      submissions: submissions || []
    });

  } catch (error: any) {
    console.error("Analytics Compute Pipeline Error:", error);
    return NextResponse.json({ error: error.message || "Failed computing performance profile matrix charts." }, { status: 500 });
  }
}