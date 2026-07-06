// src/app/api/results/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const studentId = body.studentId;

    // Validation
    if (!studentId) {
      return NextResponse.json(
        {
          error: 'Missing student ID',
        },
        {
          status: 400,
        }
      );
    }

    // Fetch only this student's submissions
    const {
      data: submissions,
      error: submissionsError,
    } = await supabaseAdmin
      .from('test_submissions')
      .select('*')
      .eq('student_id', studentId)
      .order('score', { ascending: false });

    if (submissionsError) {
      throw submissionsError;
    }

    // No participated tests
    if (!submissions || submissions.length === 0) {
      return NextResponse.json({
        results: [],
      });
    }

    // Unique test ids
    const uniqueTestIds = [
      ...new Set(
        submissions.map(
          (submission) => submission.test_id
        )
      ),
    ];

    // Fetch linked tests
    const {
      data: tests,
      error: testsError,
    } = await supabaseAdmin
      .from('tests')
      .select(`
        id,
        title,
        description,
        creator_name,
        creator_college
      `)
      .in('id', uniqueTestIds);

    if (testsError) {
      throw testsError;
    }

    // Build final results payload
    const results = submissions.map(
      (submission) => {

        const matchedTest = tests?.find(
          (test) =>
            test.id === submission.test_id
        );

        const maxScore =
          submission.total_questions * 2;

        const percentage = Math.max(
          0,
          Math.round(
            (submission.score / maxScore) * 100
          )
        );

        return {
          id: submission.id,

          test_id: submission.test_id,

          student_name:
            submission.student_name,

          score: submission.score,

          total_questions:
            submission.total_questions,

          max_score: maxScore,

          percentage,

          submitted_at:
            submission.created_at || null,

          test: matchedTest || null,
        };
      }
    );

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (err: any) {

    console.error(
      'Results API Error:',
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