import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    let textToAnalyze = "";

    // 1. Stable, serverless-friendly PDF text extraction using pdfjs-dist
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        
        // Dynamically import the PDF.js library
        const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
        
        // Configure the worker to prevent sandbox errors in Vercel
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        const loadingTask = pdfjs.getDocument({ data });
        const doc = await loadingTask.promise;
        
        let fullText = "";
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          // Extract text items safely
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }
        
        textToAnalyze = fullText;
      } catch (pdfErr) {
        console.error("PDF Parsing Stream Exception:", pdfErr);
        const errMsg = pdfErr instanceof Error ? pdfErr.message : "PDF extraction failed";
        return NextResponse.json({ error: `Failed reading target PDF: ${errMsg}` }, { status: 500 });
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

    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Groq credential validation key is missing." }, { status: 500 });
    }

    const systemPrompt = `
      You are an expert academic assessment engine for a college. Output your entire response as a valid JSON object.
      Analyze the provided reference source text and extract high-quality assessment questions.

      You must support: 'MCQ', 'MSQ', and 'FITB'.
      
      CRITICAL FORMATTING INSTRUCTION:
      Each question object MUST contain BOTH snake_case and camelCase parameters containing identical values.
      
      Return ONLY a valid JSON:
      {
        "questions": [
          {
            "id": "unique-uuid",
            "type": "MCQ",
            "question_text": "...",
            "questionText": "...",
            "options": ["...", "...", "...", "..."],
            "correct_answers": ["..."],
            "correctAnswers": ["..."]
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
      return NextResponse.json({ error: `Groq gateway rejected payload: ${response.status}` }, { status: 502 });
    }

    const aiResult = await response.json();
    let rawContent = aiResult.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      return NextResponse.json({ error: "Groq returned an empty response." }, { status: 502 });
    }

    rawContent = rawContent.replace(/^```json/, "").replace(/```$/, "").trim();

    try {
      const testData = JSON.parse(rawContent);
      return NextResponse.json(testData);
    } catch (parseErr) {
      return NextResponse.json({ error: "AI response structure failed schema compilation." }, { status: 500 });
    }

  } catch (error) {
    console.error("CRITICAL BACKEND FAILURE:", error);
    return NextResponse.json({ error: "Internal Engine parsing failure." }, { status: 500 });
  }
}