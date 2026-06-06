import { NextRequest, NextResponse } from 'next/server';

// POLYFILL: Prevent Vercel/Next.js from crashing when compiling legacy PDF browser APIs
if (typeof global !== "undefined" && typeof (global as any).DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {};
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    let textToAnalyze = "";

    // 1. Process PDF ONLY if a file is provided
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // DYNAMIC IMPORT WITH SMART RESOLUTION
        const rawModule = await import('pdf-parse');
        
        // Next.js bundlers sometimes deeply nest default exports. This digs through them securely.
        let pdfFunc: any = rawModule;
        if (typeof pdfFunc !== 'function') pdfFunc = rawModule.default;
        if (typeof pdfFunc !== 'function') pdfFunc = (rawModule as any).default?.default;
        
        if (typeof pdfFunc !== 'function') {
            throw new Error(`Bundler export mangled. Expected function, got ${typeof pdfFunc}`);
        }

        const data = await pdfFunc(buffer);
        textToAnalyze = data.text;
      } catch (pdfErr) {
        console.error("PDF Parsing Stream Exception:", pdfErr);
        const errMsg = pdfErr instanceof Error ? pdfErr.message : "Unknown file read binary fault";
        return NextResponse.json({ error: `Failed reading target PDF document: ${errMsg}` }, { status: 500 });
      }
    } else if (rawText) {
      textToAnalyze = rawText;  
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      return NextResponse.json({ error: "No clear text content isolated from form vectors." }, { status: 400 });
    }

    // Protect token windows by clamping text bounds
    if (textToAnalyze.length > 40000) {
      textToAnalyze = textToAnalyze.substring(0, 40000);
    }

    // Environment variable validation
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Groq credential validation key is missing from environment vectors." }, { status: 500 });
    }

    // 2. Instruct the engine to generate both snake_case and camelCase parameters
    const systemPrompt = `
      You are an expert academic assessment engine for a college. Output your entire response as a valid JSON object.
      Analyze the provided reference source text and extract high-quality assessment questions.

      You must support three types of questions:
      - 'MCQ' (Single Choice: 4 options, exactly 1 correct answer)
      - 'MSQ' (Multiple Selection: 4 options, 1 or more correct answers)
      - 'FITB' (Fill in the blanks: 0 options, correct answers contain plain text terms)

      CRITICAL FORMATTING INSTRUCTION:
      To avoid frontend component variable crashes, each question object in the array MUST contain BOTH snake_case and camelCase parameters containing identical values.
      
      Return ONLY a valid JSON matching this schema wrapper structure:
      {
        "questions": [
          {
            "id": "generate-a-unique-string-uuid-here",
            "type": "MCQ",
            "question_text": "Question statement text string?",
            "questionText": "Question statement text string?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answers": ["Option A"],
            "correctAnswers": ["Option A"]
          }
        ]
      }
    `;

    // 3. Connect to current production 'llama-3.3-70b-versatile' architecture
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
          { role: "user", content: `Reference Source Material:\n\n${textToAnalyze}` }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const groqErrorMsg = await response.text();
      console.error("Groq Gateway Rejection Channel Error:", groqErrorMsg);
      return NextResponse.json({ error: `Groq gateway rejected payload context: status ${response.status}` }, { status: 502 });
    }

    const aiResult = await response.json();
    let rawContent = aiResult.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      return NextResponse.json({ error: "Groq returned a malformed empty messaging node." }, { status: 502 });
    }

    // Clean markdown wrappers safely if leaked through
    rawContent = rawContent.trim();
    if (rawContent.startsWith("```json")) {
      rawContent = rawContent.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (rawContent.startsWith("```")) {
      rawContent = rawContent.replace(/^```/, "").replace(/```$/, "").trim();
    }

    try {
      const testData = JSON.parse(rawContent);
      return NextResponse.json(testData);
    } catch (parseErr) {
      console.error("Scrub Parsing Crash Tracker. Content raw:", rawContent);
      return NextResponse.json({ error: "AI response structure failed schema compilation checks." }, { status: 500 });
    }

  } catch (error) {
    console.error("CRITICAL BACKEND FAILURE TRACE:", error);
    const catchMsg = error instanceof Error ? error.message : "Internal Engine parsing failure trace.";
    return NextResponse.json({ error: catchMsg }, { status: 500 });
  }
}