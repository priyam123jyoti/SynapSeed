import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Initialize a highly privileged administrative instance.
// This bypasses RLS rules on the server side so teachers can securely aggregate overall student metrics.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Ensure this variable is present in your .env.local and Vercel environment variables
);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await context.params;

    if (!testId) {
      return NextResponse.json({ error: "Missing required Test ID parameter." }, { status: 400 });
    }

    // 1. Fetch Quiz Title using admin privileges
    const { data: test, error: testError } = await supabaseAdmin
      .from('quizzes')
      .select('title')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    // 2. Fetch all associated questions directly
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('questions')
      .select('id')
      .eq('quiz_id', testId);

    if (questionsError) throw questionsError;

    // 3. Fetch ALL student submissions, bypassing RLS limitations
    const { data: submissions, error: subError } = await supabaseAdmin
      .from('quiz_submissions')
      .select('*')
      .eq('quiz_id', testId)
      .order('submitted_at', { ascending: false });

    if (subError) throw subError;

    const totalSubmissions = submissions?.length ?? 0;
    const totalQuestions = questions?.length ?? 0;

    let classAverage = 0;
    let highestScore = 0;

    // 4. Calculate critical metrics safely
    if (totalSubmissions > 0 && submissions) {
      const sum = submissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
      classAverage = parseFloat((sum / totalSubmissions).toFixed(2));
      highestScore = Math.max(...submissions.map(s => s.score || 0));
    }

    // 5. Structure payload return contract for frontend absorption
    return NextResponse.json({
      quizTitle: test.title,
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