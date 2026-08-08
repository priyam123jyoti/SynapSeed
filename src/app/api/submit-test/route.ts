// src/app/api/submit-test/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Question } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      testId,
      studentId,
      studentName,
      answers,
    } = body;

    // =========================
    // Validation
    // =========================

    if (!testId) {
      return NextResponse.json(
        {
          error: 'Missing test ID.',
        },
        {
          status: 400,
        }
      );
    }

    if (!studentId) {
      return NextResponse.json(
        {
          error: 'Missing student ID.',
        },
        {
          status: 400,
        }
      );
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        {
          error: 'Invalid answers payload.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // Fetch Questions
    // =========================

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
        {
          error: 'No questions found for this test.',
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // Score Evaluation
    // =========================

    let finalScore = 0;

    const totalQuestions = serverQuestions.length;

    for (const question of serverQuestions as Question[]) {
      const studentAnswers: string[] =
        answers[question.id] || [];

      const correctAnswers: string[] =
        question.correct_answers || [];

      // Skip unanswered
      if (studentAnswers.length === 0) {
        continue;
      }

      // =========================
      // MCQ + MSQ ONLY
      // =========================

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

      // Ignore unsupported question types
    }

    // =========================
    // Prevent Negative Final Score
    // =========================

    if (finalScore < 0) {
      finalScore = 0;
    }

    // =========================
    // Store Submission
    // =========================

    const {
      data: submission,
      error: insertError,
    } = await supabaseAdmin
      .from('test_submissions')
      .insert([
        {
          test_id: testId,

          student_id: studentId,

          student_name:
            studentName ||
            'Anonymous Student',

          student_answers: answers,

          score: finalScore,

          total_questions:
            totalQuestions,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // =========================
    // Success Response
    // =========================

    return NextResponse.json({
      success: true,

      submissionId: submission.id,

      score: finalScore,

      maxScore:
        totalQuestions * 2,

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
          err.message ||
          'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}