import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await context.params;

    if (!testId) {
      return NextResponse.json({ error: "Missing required Test ID parameter." }, { status: 400 });
    }

    // Step 1: Fetch the Quiz Title
    const { data: test, error: testError } = await supabase
      .from('quizzes')
      .select('title')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: "Quiz registry identifier not found." }, { status: 404 });
    }

    // Step 2: Look up the actual question row count from your 'questions' table
    const { count: totalQuestions, error: qCountError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_id', testId);

    if (qCountError) console.error("⚠️ Failed to parse structural rows count:", qCountError);

    // Step 3: Fetch related performance rows from 'quiz_submissions'
    const { data: submissions, error: subError } = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('quiz_id', testId)
      .order('submitted_at', { ascending: false });

    const cleanSubmissions = subError ? [] : (submissions || []);
    const totalSubmissions = cleanSubmissions.length;

    let classAverage = 0;
    let highestScore = 0;

    // Step 4: Safely calculate dashboard statistics
    if (totalSubmissions > 0) {
      const sum = cleanSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
      classAverage = parseFloat((sum / totalSubmissions).toFixed(2));
      highestScore = Math.max(...cleanSubmissions.map(s => s.score || 0));
    }

    return NextResponse.json({
      quizTitle: test.title,
      totalQuestions: totalQuestions || 0,
      metrics: {
        totalSubmissions,
        classAverage,
        highestScore,
      },
      submissions: cleanSubmissions,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Pipeline execution failure" }, { status: 500 });
  }
}