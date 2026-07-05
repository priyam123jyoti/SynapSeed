// src/app/api/submit-test/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Question } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      testId,
      studentName,
      answers,
    } = body;

    // Basic validation
    if (!testId) {
      return NextResponse.json(
        { error: 'Missing test ID.' },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid answers payload.' },
        { status: 400 }
      );
    }

    // Fetch official questions from database
    const {
      data: serverQuestions,
      error: questionError,
    } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('test_id', testId);

    if (questionError) {
      throw questionError;
    }

    if (!serverQuestions || serverQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found for this test.' },
        { status: 404 }
      );
    }

    let finalScore = 0;

    const totalQuestions = serverQuestions.length;

    // Score evaluation engine
    serverQuestions.forEach((question: Question) => {
      const studentAnswers: string[] =
        answers[question.id] || [];

      const correctAnswers: string[] =
        question.correct_answers || [];

      // Skip unanswered
      if (studentAnswers.length === 0) {
        return;
      }

      // MCQ + MSQ
      if (
        question.type === 'MCQ' ||
        question.type === 'MSQ'
      ) {
        const isCorrect =
          studentAnswers.length ===
            correctAnswers.length &&
          studentAnswers.every((answer) =>
            correctAnswers.includes(answer)
          );

        if (isCorrect) {
          finalScore += 2;
        } else {
          finalScore -= 1;
        }
      }

      // FITB
      else if (question.type === 'FITB') {
        const submitted =
          studentAnswers[0]?.trim().toLowerCase();

        const matched = correctAnswers.some(
          (correct) =>
            correct.trim().toLowerCase() === submitted
        );

        if (matched) {
          finalScore += 2;
        } else {
          finalScore -= 1;
        }
      }
    });

    // Prevent negative score overflow
    if (finalScore < 0) {
      finalScore = 0;
    }

    // Store submission
const {
  data: submission,
  error: insertError,
} = await supabaseAdmin
  .from('test_submissions')
  .insert([
    {
      test_id: testId,
      student_name:
        studentName || 'Anonymous Student',
      student_answers: answers,
      score: finalScore,
      total_questions: totalQuestions,
    },
  ])
  .select()
  .single();

    if (insertError) {
      throw insertError;
    }

return NextResponse.json({
  success: true,
  submissionId: submission.id,
  score: finalScore,
  maxScore: totalQuestions * 2,
  totalQuestions,
});

  } catch (err: any) {
    console.error(
      'Submission API Error:',
      err.message
    );

    return NextResponse.json(
      {
        error:
          err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}