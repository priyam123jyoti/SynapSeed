import { NextRequest, NextResponse } from 'next/server';
// Use Node's native require syntax to bypass the missing ESM default export warnings
const pdfParser = require('pdf-parse');

export const runtime = 'nodejs'; // Required for pdf-parse parsing native buffers

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    let textToAnalyze = "";

    // 1. Process PDF if provided (completely in memory, never saved)
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // FIXED: pdf-parse is a function wrapper. It executes directly on the buffer.
      const pdfData = await pdfParser(buffer);
      textToAnalyze = pdfData.text || "";
    } else if (rawText) {
      textToAnalyze = rawText;  
    }

    if (!textToAnalyze.trim()) {
      return NextResponse.json({ error: "No text contents extracted." }, { status: 400 });
    }

    // Enforce safe character ceiling limits
    if (textToAnalyze.length > 45000) {
      textToAnalyze = textToAnalyze.substring(0, 45000);
    }

    // 2. Call the Groq AI Engine with structured compilation instructions
    const systemPrompt = `
      You are an expert academic assessment engine for a college.
      Analyze the provided reference source text and extract or generate high-quality assessment questions.

      CRITICAL RULE FOR PRE-EXISTING QUESTIONS (PYQs/Tests):
      If the reference text contains pre-existing questions (Previous Year Questions, explicitly typed tests, printed MCQs, or Fill-in-the-Blanks) with their corresponding correct options/answers, you MUST extract them EXACTLY as they are written. Do not alter their wording or options. Use the answer keys written in the text.

      RULE FOR GENERAL TOPIC TEXTS:
      If the text is just general study materials, notes, or textbook paragraphs (e.g., cell division explanation), use your internal knowledge to generate relevant, accurate questions based on the material, and determine the correct options.

      You must support three types of questions:
      - 'MCQ' (Single Choice: 4 options, exactly 1 correct answer)
      - 'MSQ' (Multiple Selection: 4 options, 1 or more correct answers)
      - 'FITB' (Fill in the blanks: 0 options, the correct_answers array contains acceptable text terms)

      Return ONLY a valid JSON object matching this structure exactly. Do not include markdown code blocks, formatting wrapper text, or explanations:
      {
        "questions": [
          {
            "type": "MCQ",
            "question_text": "What phase comes after prophase?",
            "options": ["Metaphase", "Anaphase", "Telophase", "Interphase"],
            "correct_answers": ["Metaphase"]
          }
        ]
      }
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Reference Source Material:\n\n${textToAnalyze}` }
        ],
        temperature: 0.2, // Low temperature ensures strict data compliance
        response_format: { type: "json_object" } // Enforces pure JSON payload output
      }),
    });

    const aiResult = await response.json();
    
    if (!aiResult.choices?.[0]?.message?.content) {
      throw new Error("Invalid or empty response structure from Groq API.");
    }

    const quizData = JSON.parse(aiResult.choices[0].message.content);
    return NextResponse.json(quizData);

  } catch (error: any) {
    console.error("AI Generation Failure:", error);
    return NextResponse.json({ error: "Failed to parse document or generate quiz matrix." }, { status: 500 });
  }
}