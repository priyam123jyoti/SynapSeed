import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { context } = await req.json();
    
    // Grabs your secret variable from .env.local or Vercel
    // Ensure this matches your exact key name (e.g., GROQ_API_KEY)
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API Key configuration missing from environment rules.' }, 
        { status: 500 }
      );
    }

    if (!context || context.length > 40000) {
      return NextResponse.json(
        { error: 'Payload bounds out of limits. Maximum text limit is 40k characters.' }, 
        { status: 400 }
      );
    }

    // This forces the AI to output the exact type layout our system expects
    const systemInstructionSchema = `You are a strict automated assessment generator for an LMS. 
Analyze the provided text material and generate matching assessment questions.
You MUST choose from these three exact data types:
1. 'MCQ' (Multiple Choice - single selection, options array has 4 items, correct_answers has exactly 1 matching item string)
2. 'MSQ' (Multiple Select - multi selection, options array has 4 items, correct_answers contains 1 or more matching item strings)
3. 'FITB' (Fill In The Blanks - fill in, options array must be null, correct_answers contains valid strings)

Your response must strictly match this JSON schema structure:
{
  "questions": [
    {
      "id": "generate-a-short-random-unique-id",
      "type": "MCQ" | "MSQ" | "FITB",
      "question_text": "The prompt string question goes here...",
      "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
      "correct_answers": ["Exact text matching the correct option values"]
    }
  ]
}`;

    // Executing lightning fast inference on Groq's architecture
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Ultra-reliable 2026 reasoning flagship model
        messages: [
          { role: 'system', content: systemInstructionSchema },
          { role: 'user', content: `Analyze this reference context material and generate appropriate questions:\n\n${context}` }
        ],
        response_format: { type: 'json_object' }, // Guarantees flawless program parsing
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      throw new Error(`Groq API platform breakdown: ${errorPayload}`);
    }

    const groqRawData = await response.json();
    const jsonStringOutput = groqRawData.choices[0].message.content;
    const verifiedDataPayload = JSON.parse(jsonStringOutput);

    return NextResponse.json({ questions: verifiedDataPayload.questions || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}