import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API Key." }, { status: 500 });
    }

    const systemPrompt = `You are an expert academic assessment engine.
Generate questions from the provided content.
Support types: MCQ, MSQ, FITB.
Return ONLY valid JSON, no markdown, no backticks, no explanation.
Each question MUST have both snake_case and camelCase keys with identical values.
Schema:
{
  "questions": [
    {
      "id": "unique-string",
      "type": "MCQ",
      "question_text": "text",
      "questionText": "text",
      "options": ["A", "B", "C", "D"],
      "correct_answers": ["A"],
      "correctAnswers": ["A"]
    }
  ]
}`;

    let requestBody: any;

    if (file) {
      // PDF path: send file directly to Gemini as base64
      // Gemini reads the PDF natively — no parsing library needed
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');

      requestBody = {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: "application/pdf",
                  data: base64
                }
              },
              {
                text: systemPrompt + "\n\nExtract content from the PDF above and generate questions."
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      };
    } else if (rawText) {
      // Plain text path
      requestBody = {
        contents: [
          {
            parts: [
              {
                text: systemPrompt + "\n\nReference Source:\n\n" + rawText.substring(0, 40000)
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      };
    } else {
      return NextResponse.json({ error: "No content provided." }, { status: 400 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini Error:", err);
      return NextResponse.json({ error: "Gemini API rejected the request." }, { status: 502 });
    }

    const aiResult = await response.json();
    let rawContent = aiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json({ error: "Empty response from Gemini." }, { status: 502 });
    }

    rawContent = rawContent.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

    try {
      const testData = JSON.parse(rawContent);
      return NextResponse.json(testData);
    } catch {
      console.error("JSON parse failed. Raw content:", rawContent);
      return NextResponse.json({ error: "AI output could not be parsed as JSON." }, { status: 500 });
    }

  } catch (error) {
    console.error("CRITICAL BACKEND FAILURE:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}