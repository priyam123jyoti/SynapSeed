import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: testId } = await context.params;

    // Parse the incoming data from the frontend
    const body = await req.json();
    const { student_name, score, total_questions } = body;

    // Validate the payload
    if (!testId || !student_name || typeof score !== 'number' || typeof total_questions !== 'number') {
      return NextResponse.json({ error: "Invalid submission data." }, { status: 400 });
    }

    // Insert the exact data your analytics dashboard is expecting
    const { error: insertError } = await supabase
      .from('test_submissions')
      .insert([
        {
          test_id: testId,
          student_name: student_name,
          score: score,
          total_questions: total_questions,
          // submitted_at usually defaults to NOW() in Supabase automatically
        }
      ]);

    if (insertError) {
      console.error("Database Insert Error:", insertError);
      return NextResponse.json({ error: "Failed to save results to the database." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Submission logged successfully." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Pipeline execution failure" }, { status: 500 });
  }
}