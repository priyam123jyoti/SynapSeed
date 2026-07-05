// src/app/api/results/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all submissions
    const {
      data: submissions,
      error: submissionError,
    } = await supabaseAdmin
      .from('test_submissions')
      .select(`
        id,
        score,
        total_questions,
        created_at,
        test_id
      `)
      .order('created_at', {
        ascending: false,
      });

    if (submissionError) {
      throw submissionError;
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json({
        results: [],
      });
    }

    // Fetch related tests
    const testIds = submissions.map(
      (submission) => submission.test_id
    );

    const {
      data: tests,
      error: testsError,
    } = await supabaseAdmin
      .from('tests')
      .select(`
        id,
        title,
        description
      `)
      .in('id', testIds);

    if (testsError) {
      throw testsError;
    }

    // Merge results
    const results = submissions.map(
      (submission) => {
        const matchedTest = tests?.find(
          (test) => test.id === submission.test_id
        );

        return {
          id: submission.id,
          score: submission.score,
          total_questions:
            submission.total_questions,
          created_at:
            submission.created_at,

          percentage: Math.round(
            (submission.score /
              (submission.total_questions * 2)) *
              100
          ),

          test: matchedTest || null,
        };
      }
    );

    return NextResponse.json({
      results,
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          err.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}