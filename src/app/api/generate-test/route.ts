import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawText = formData.get('text') as string | null;

    if (!rawText || !rawText.trim()) {
      return NextResponse.json({ error: "No content provided." }, { status: 400 });
    }

    const textToAnalyze = rawText.length > 40000
      ? rawText.substring(0, 40000)
      : rawText;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key." }, { status: 500 });
    }

    const systemPrompt = `You are an expert academic assessment engine. Output valid JSON only.
Support types: MCQ, MSQ, FITB.
Each question MUST have both snake_case and camelCase keys with identical values.
Return ONLY this JSON, no markdown, no backticks, no explanation:
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
          { role: "user", content: `Generate questions from this content:\n\n${textToAnalyze}` }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq Error:", err);
      return NextResponse.json({ error: "Groq API request failed." }, { status: 502 });
    }

    const aiResult = await response.json();
    let rawContent = aiResult.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json({ error: "Empty response from Groq." }, { status: 502 });
    }

    rawContent = rawContent.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

    const testData = JSON.parse(rawContent);
    return NextResponse.json(testData);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}