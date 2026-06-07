import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await context.params;

    if (!testId) {
      return NextResponse.json({ error: "Missing required Test ID parameter." }, { status: 400 });
    }

    const { data: test, error: testError } = await supabase
      .from('quizzes')
      .select('title')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    // Fetch questions separately from the questions table
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id')
      .eq('quiz_id', testId);

    if (questionsError) throw questionsError;

    const { data: submissions, error: subError } = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('quiz_id', testId)
      .order('submitted_at', { ascending: false });

    if (subError) throw subError;

    const totalSubmissions = submissions?.length ?? 0;
    const totalQuestions = questions?.length ?? 0;

    let classAverage = 0;
    let highestScore = 0;

    if (totalSubmissions > 0 && submissions) {
      const sum = submissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
      classAverage = parseFloat((sum / totalSubmissions).toFixed(2));
      highestScore = Math.max(...submissions.map(s => s.score || 0));
    }

    return NextResponse.json({
      quizTitle: test.title,  // was testTitle — frontend reads quizTitle
      totalQuestions,
      metrics: {
        totalSubmissions,
        classAverage,
        highestScore,
      },
      submissions: submissions || [],
    });

  } catch (error: any) {
    console.error("Analytics route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to compute analytics." },
      { status: 500 }
    );
  }
}