import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// 🔒 Switched to the secret admin key to bypass RLS policies safely on the backend
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, questionsArray } = body;

    if (!title || !questionsArray || !Array.isArray(questionsArray) || questionsArray.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. Test title and questions are required." },
        { status: 400 }
      );
    }

    console.log(`[Supabase API] Step 1: Inserting test metadata into 'tests' table...`);

    // Step 1: Insert the test header
    const { data: testData, error: testError } = await supabase
      .from("tests") 
      .insert([{ title, description: description || "Departmental Evaluation" }])
      .select("id")
      .single();

    if (testError || !testData) {
      console.error("❌ Test Insertion Fault:", testError);
      return NextResponse.json({ error: `Test creation failed: ${testError.message}` }, { status: 500 });
    }

    const newTestId = testData.id;
    console.log(`[Supabase API] Step 2: Batch inserting ${questionsArray.length} questions for Test UUID: ${newTestId}...`);

    // Step 2: Format questions array to match your schema requirements
    const formattedQuestions = questionsArray.map((q) => ({
      test_id: newTestId,
      type: q.type,
      question_text: q.question_text,
      options: q.type === "FITB" ? null : q.options, 
      correct_answers: q.correct_answers,
    }));

    // Step 3: Write rows to the questions table
    const { error: questionsError } = await supabase
      .from("questions")
      .insert(formattedQuestions);

    if (questionsError) {
      console.error("❌ Questions Batch Insertion Fault:", questionsError);
      // Clean up orphaned test header if questions fail to preserve integrity
      await supabase.from("tests").delete().eq("id", newTestId);
      return NextResponse.json({ error: `Questions mapping failed: ${questionsError.message}` }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      testId: newTestId 
    }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 API Pipeline Failure:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}