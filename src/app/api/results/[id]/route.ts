// src/app/api/results/[id]/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing submission ID' },
        { status: 400 }
      );
    }

    // Fetch submission
    const {
      data: submission,
      error: submissionError,
    } = await supabaseAdmin
      .from('test_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (submissionError || !submission) {
      throw new Error('Submission not found');
    }

    // Fetch test
    const {
      data: test,
      error: testError,
    } = await supabaseAdmin
      .from('tests')
      .select(`
        id,
        title,
        description,
        questions(*)
      `)
      .eq('id', submission.test_id)
      .single();

    if (testError || !test) {
      throw new Error('Test not found');
    }

    return NextResponse.json({
      submission: {
        ...submission,
        test,
      },
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