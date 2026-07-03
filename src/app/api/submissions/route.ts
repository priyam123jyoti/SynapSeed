import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Question } from '@/types';

export async function POST(req: Request) {
  try {
    const { testId, studentName, answers } = await req.json(); // answers model schema: { question_id: [string_selections] }

    // Read full structural answers criteria directly from secure data storage definitions
    const { data: serverQuestions, error: qErr } = await supabaseAdmin
      .from('questions')
      .select('*')
      .eq('test_id', testId);

    if (qErr || !serverQuestions) throw new Error('System source verification data retrieval broke down.');

    let runtimeCalculatedScore = 0;
    const totalQuestionsCount = serverQuestions.length;

    // Loop through the verified database configurations to compare against student inputs
    serverQuestions.forEach((question: Question) => {
      // Cast arrays explicitly to strings to eliminate implicit 'any' compile blocks
      const studentSelectionArray: string[] = answers[question.id] || [];
      const accurateTargetVerificationArray: string[] = question.correct_answers || [];

      // Rule Case 1: Skipped / Empty Arrays
      if (studentSelectionArray.length === 0) {
        runtimeCalculatedScore += 0;
        return;
      }

      // Rule Case 2: Validation Evaluation Logic for Multiple Select Questions (MSQ) & Multiple Choice Questions (MCQ)
      if (question.type === 'MCQ' || question.type === 'MSQ') {
        const isEverySelectionCorrect = 
          studentSelectionArray.length === accurateTargetVerificationArray.length &&
          studentSelectionArray.every((val: string) => accurateTargetVerificationArray.includes(val));

        if (isEverySelectionCorrect) {
          runtimeCalculatedScore += 2;
        } else {
          runtimeCalculatedScore -= 1;
        }
      } 
      
      // Rule Case 3: Validation Evaluation Logic for Fill In The Blanks (FITB)
      else if (question.type === 'FITB') {
        // Checking array index position matches string equality case invariants
        const matchingCheck = accurateTargetVerificationArray.some(
          (targetString: string) => targetString.toLowerCase() === studentSelectionArray[0]?.toLowerCase()
        );

        if (matchingCheck) {
          runtimeCalculatedScore += 2;
        } else {
          runtimeCalculatedScore -= 1;
        }
      }
    });

    // Write final validated score metrics to Supabase
    const { error: insertErr } = await supabaseAdmin
      .from('test_submissions')
      .insert([{
        test_id: testId,
        student_name: studentName,
        student_answers: answers,
        score: runtimeCalculatedScore,
        total_questions: totalQuestionsCount
      }]);

    if (insertErr) throw insertErr;

    return NextResponse.json({ 
      success: true, 
      evaluatedScore: runtimeCalculatedScore, 
      maxPossibleScore: totalQuestionsCount * 2 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}