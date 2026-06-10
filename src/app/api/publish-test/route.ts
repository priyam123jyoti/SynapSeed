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

    console.log(`[Supabase API] Step 1: Inserting quiz metadata into 'quizzes' table...`);

    // Step 1: Insert the quiz header
    const { data: quizData, error: quizError } = await supabase
      .from("quizzes") 
      .insert([{ title, description: description || "Departmental Evaluation" }])
      .select("id")
      .single();

    if (quizError || !quizData) {
      console.error("❌ Quiz Insertion Fault:", quizError);
      return NextResponse.json({ error: `Quiz creation failed: ${quizError.message}` }, { status: 500 });
    }

    const newQuizId = quizData.id;
    console.log(`[Supabase API] Step 2: Batch inserting ${questionsArray.length} questions for Quiz UUID: ${newQuizId}`);

    // Step 2: Format questions array to match your schema requirements
    const formattedQuestions = questionsArray.map((q) => ({
      quiz_id: newQuizId,
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
      // Clean up orphaned quiz header if questions fail to preserve integrity
      await supabase.from("quizzes").delete().eq("id", newQuizId);
      return NextResponse.json({ error: `Questions mapping failed: ${questionsError.message}` }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      quizId: newQuizId 
    }, { status: 200 });

  } catch (error: any) {
    console.error("🚨 API Pipeline Failure:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}