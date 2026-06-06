import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    let textToAnalyze = "";

    // 1. PDF extraction
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Dynamically import and cast to 'any' to bypass TypeScript declaration errors
        const pdfModule = (await import('pdf-parse')) as any;
        
        // Safely determine if the module itself is the function or if it's nested in .default
        const pdf = (typeof pdfModule === 'function') ? pdfModule : (pdfModule.default || pdfModule);
        
        const data = await pdf(buffer);
        textToAnalyze = data.text;
      } catch (pdfErr) {
        console.error("PDF Parsing Exception:", pdfErr);
        return NextResponse.json({ error: "Failed to parse PDF file." }, { status: 500 });
      }
    } else if (rawText) {
      textToAnalyze = rawText;  
    }

    // 2. Validate extracted content
    if (!textToAnalyze || !textToAnalyze.trim()) {
      return NextResponse.json({ error: "No content provided." }, { status: 400 });
    }

    // Protection against token limits
    if (textToAnalyze.length > 40000) {
      textToAnalyze = textToAnalyze.substring(0, 40000);
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key." }, { status: 500 });
    }

    // 3. AI Assessment Prompt
    const systemPrompt = `
      You are an expert academic assessment engine. Output valid JSON.
      Support types: 'MCQ', 'MSQ', 'FITB'.
      CRITICAL: Each question object MUST contain BOTH snake_case and camelCase parameters containing identical values.
      Return ONLY this JSON schema:
      {
        "questions": [
          {
            "id": "uuid",
            "type": "MCQ",
            "question_text": "text",
            "questionText": "text",
            "options": ["A", "B", "C", "D"],
            "correct_answers": ["A"],
            "correctAnswers": ["A"]
          }
        ]
      }
    `;

    // 4. API Request to Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Reference Source:\n\n${textToAnalyze}` }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq Error:", err);
      return NextResponse.json({ error: "AI Gateway rejected the request." }, { status: 502 });
    }

    const aiResult = await response.json();
    let rawContent = aiResult.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 502 });
    }

    // Clean potential markdown blocks
    rawContent = rawContent.replace(/^```json/, "").replace(/```$/, "").trim();

    try {
      const testData = JSON.parse(rawContent);
      return NextResponse.json(testData);
    } catch (parseErr) {
      return NextResponse.json({ error: "AI output could not be parsed as JSON." }, { status: 500 });
    }

  } catch (error) {
    console.error("CRITICAL BACKEND FAILURE:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}