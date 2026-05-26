import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    let textToAnalyze = "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Dynamic inline require prevents build-time compilation environment glitches
      const pdfParser = require('pdf-parse');
      const pdfData = await pdfParser(buffer);
      textToAnalyze = pdfData.text || "";
    } else if (rawText) {
      textToAnalyze = rawText;  
    }

    if (!textToAnalyze.trim()) {
      return NextResponse.json({ error: "No clear textual data isolated inside request objects." }, { status: 400 });
    }

    if (textToAnalyze.length > 45000) {
      textToAnalyze = textToAnalyze.substring(0, 45000);
    }

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
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    
    if (!aiResult.choices?.[0]?.message?.content) {
      throw new Error("Empty compilation metadata response from remote Groq clusters.");
    }

    const testData = JSON.parse(aiResult.choices[0].message.content);
    return NextResponse.json(testData);

  } catch (error: any) {
    console.error("AI Evaluation Layer Generation Failure:", error);
    return NextResponse.json({ error: "Failed to parse document or generate test matrix layout arrays." }, { status: 500 });
  }
}