import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    let textToAnalyze = "";

    // 1. Process PDF using the official Mozilla PDFJS engine safely in Node.js
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        
        // Load legacy headless configuration explicitly
        const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
        const loadingTask = pdfjs.getDocument({ data: buffer });
        const pdfDocument = await loadingTask.promise;
        
        let extractedPages: string[] = [];
        const pagesToRead = Math.min(pdfDocument.numPages, 8);
        
        for (let i = 1; i <= pagesToRead; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          extractedPages.push(pageText);
        }
        textToAnalyze = extractedPages.join(" ");
      } catch (pdfErr: any) {
        console.error("PDF Parsing Stream Exception:", pdfErr);
        return NextResponse.json({ error: `Failed reading target PDF document: ${pdfErr.message}` }, { status: 500 });
      }
    } else if (rawText) {
      textToAnalyze = rawText;  
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      return NextResponse.json({ error: "No clear text content isolated from form vectors." }, { status: 400 });
    }

    if (textToAnalyze.length > 40000) {
      textToAnalyze = textToAnalyze.substring(0, 40000);
    }

    // RESOLVE API KEY: Fall back safely between environment variable conventions
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Groq credential validation key is missing from environment vectors." }, { status: 500 });
    }

    // 2. Instruct the engine to generate both snake_case and camelCase parameters to fix frontend mismatches
    const systemPrompt = `
      You are an expert academic assessment engine for a college.
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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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

    // Safe string scrub sequence to extract cleaner JSON if any markdown leaks through
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

  } catch (error: any) {
    console.error("CRITICAL BACKEND FAILURE TRACE:", error);
    return NextResponse.json({ error: error.message || "Internal Engine parsing failure trace." }, { status: 500 });
  }
}