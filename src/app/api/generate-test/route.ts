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
      
      // FIXED: Pass options to completely disable page canvas rendering dependencies
      const pdfParser = require('pdf-parse');
      
      const options = {
        // This stops pdf-parse from trying to load missing canvas binary structures
        pagerender: function(pageData: any) {
          return pageData.getTextContent().then(function(textContent: any) {
            return textContent.items.map((item: any) => item.str).join(' ');
          });
        }
      };

      const pdfData = await pdfParser(buffer, options);
      textToAnalyze = pdfData.text || "";
    } else if (rawText) {
      textToAnalyze = rawText;  
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      return NextResponse.json({ error: "No clear text content isolated." }, { status: 400 });
    }

    if (textToAnalyze.length > 40000) {
      textToAnalyze = textToAnalyze.substring(0, 40000);
    }

    // Call your Groq AI Engine pipeline safely below
    const systemPrompt = `
      You are an expert academic assessment engine for a college.
      Analyze the provided reference source text and extract or generate high-quality assessment questions.

      Return ONLY a valid JSON object matching this structure exactly. Do not include markdown code blocks, formatting wrapper text, or explanations:
      {
        "questions": [
          {
            "type": "MCQ",
            "question_text": "Sample Question Text Here?",
            "options": ["Opt1", "Opt2", "Opt3", "Opt4"],
            "correct_answers": ["Opt1"]
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
      return NextResponse.json({ error: "Groq did not return structured valid choices data." }, { status: 502 });
    }

    const testData = JSON.parse(aiResult.choices[0].message.content);
    return NextResponse.json(testData);

  } catch (error: any) {
    // Check your terminal console printout to see the exact trace log line error
    console.error("CRITICAL BACKEND FAILURE TRACE:", error);
    return NextResponse.json({ error: error.message || "Failed parsing data streams natively." }, { status: 500 });
  }
}