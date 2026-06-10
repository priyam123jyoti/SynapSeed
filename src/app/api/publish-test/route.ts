import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON payload from your TestCreator component
    const body = await request.json();
    const { title, description, questionsArray } = body;

    // 2. Server-Side Validation: Ensure no empty payloads slip through
    if (!title || !questionsArray || !Array.isArray(questionsArray) || questionsArray.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. Test title and at least one question are required." },
        { status: 400 }
      );
    }

   console.log(`[API] Processing new test: "${title}" - ${description || "No description"} (${questionsArray.length} questions)`);
    // ==========================================
    // 🗄️ DATABASE INTEGRATION ZONE
    // ==========================================
    // This is where you save the data to Supabase, Prisma, MongoDB, etc.
    // 
    // EXAMPLE PRISMA IMPLEMENTATION:
    /*
    const newTest = await prisma.test.create({
      data: {
        title: title,
        description: description,
        questions: {
          create: questionsArray.map((q) => ({
            type: q.type,
            prompt: q.question_text,
            options: q.options,
            correctAnswers: q.correct_answers
          }))
        }
      }
    });
    const generatedQuizId = newTest.id;
    */

    // For now, we will generate a mock ID so your frontend redirect works immediately.
    // (Replace this with your actual database response ID later)
    const generatedQuizId = "test_" + Math.random().toString(36).substring(2, 11);

    // 3. Return the success response
    // The frontend strictly looks for `data.quizId` to complete the routing.
    return NextResponse.json(
      { 
        success: true, 
        message: "Test published successfully.",
        quizId: generatedQuizId 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("🚨 API Publish Error:", error);
    
    // 4. Catch and return standard 500 errors so the frontend doesn't crash
    return NextResponse.json(
      { error: "Internal Server Error: " + (error.message || "Unknown fault") },
      { status: 500 }
    );
  }
}