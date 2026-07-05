import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {

    const {
      data: submissions,
      error: submissionsError,
    } = await supabaseAdmin
      .from('test_submissions')
      .select('*');

    if (submissionsError) {
      throw submissionsError;
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json({
        results: [],
      });
    }

    const uniqueTestIds = [
      ...new Set(
        submissions
          .map((s) => s.test_id)
          .filter(Boolean)
      ),
    ];

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
      .in('id', uniqueTestIds);

    if (testsError) {
      throw testsError;
    }

    const results = submissions.map(
      (submission) => {

        const matchedTest = tests?.find(
          (test) =>
            test.id === submission.test_id
        );

        return {
          id: submission.id,

          score: submission.score,

          total_questions:
            submission.total_questions,

          percentage: Math.max(
            0,
            Math.round(
              (submission.score /
                (submission.total_questions * 2)) *
                100
            )
          ),

          test: matchedTest || {
            title: 'Unknown Test',
            description: '',
          },
        };
      }
    );

    return NextResponse.json({
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