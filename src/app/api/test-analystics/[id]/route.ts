import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: quizId } = await params;

    // 1. Fetch overall quiz info (to get total questions count)
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('title, questions')
      .eq('id', quizId)
      .single();

    if (quizError) throw quizError;

    // 2. Fetch all student submissions for this quiz
    const { data: submissions, error: subError } = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('submitted_at', { ascending: false });

    if (subError) throw subError;

    // 3. Compute metric aggregates safely
    const totalSubmissions = submissions.length;
    const totalQuestions = quiz.questions.length;
    
    let classAverage = 0;
    let highestScore = 0;

    if (totalSubmissions > 0) {
      const sum = submissions.reduce((acc, curr) => acc + curr.score, 0);
      classAverage = parseFloat((sum / totalSubmissions).toFixed(2));
      highestScore = Math.max(...submissions.map(s => s.score));
    }

    return NextResponse.json({
      quizTitle: quiz.title,
      totalQuestions,
      metrics: {
        totalSubmissions,
        classAverage,
        highestScore
      },
      submissions
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}