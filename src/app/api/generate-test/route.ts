import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    let textToAnalyze = "";

    // 1. PDF extraction with build-time type bypass
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        
        // @ts-ignore: Bypassing declaration check for Vercel build
        const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
        
        // Use CDN for worker to avoid local bundling sandbox issues
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        const loadingTask = pdfjs.getDocument({ data });
        const doc = await loadingTask.promise;
        
        let fullText = "";
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
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
      return NextResponse.json({ error: "No content provided." }, { status: 400 });
    }

    // Protection against excessive tokens
    if (textToAnalyze.length > 40000) {
      textToAnalyze = textToAnalyze.substring(0, 40000);
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key." }, { status: 500 });
    }

    // 2. Academic Assessment Engine Prompt
    const systemPrompt = `
      You are an expert academic assessment engine. Output valid JSON.
      Support types: 'MCQ', 'MSQ', 'FITB'.
      CRITICAL: Each question object MUST contain BOTH snake_case and camelCase parameters.
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

    // 3. Groq API Request
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
      return NextResponse.json({ error: `Gateway rejected: ${response.status}` }, { status: 502 });
    }

    const aiResult = await response.json();
    let rawContent = aiResult.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 502 });
    }

    // Clean JSON
    rawContent = rawContent.replace(/^```json/, "").replace(/```$/, "").trim();

    try {
      const testData = JSON.parse(rawContent);
      return NextResponse.json(testData);
    } catch (parseErr) {
      return NextResponse.json({ error: "Invalid JSON structure." }, { status: 500 });
    }

  } catch (error) {
    console.error("CRITICAL FAILURE:", error);
    return NextResponse.json({ error: "Internal Engine error." }, { status: 500 });
  }
}