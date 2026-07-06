// src/app/api/generate-questions/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { context } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Groq API Key configuration missing from environment rules.',
        },
        {
          status: 500,
        }
      );
    }

    if (!context || context.length > 40000) {
      return NextResponse.json(
        {
          error:
            'Payload bounds out of limits. Maximum text limit is 40k characters.',
        },
        {
          status: 400,
        }
      );
    }

    // AI Instruction
    const systemInstructionSchema = `
You are a strict automated assessment generator for an LMS.

Analyze the provided study material and generate assessment questions.

ONLY generate these two question types:

1. "MCQ"
   - Multiple Choice
   - Exactly 4 options
   - Exactly 1 correct answer

2. "MSQ"
   - Multiple Select
   - Exactly 4 options
   - One or more correct answers

DO NOT generate Fill in the Blank (FITB), True/False, Short Answer, Essay, or any other question type.

Return ONLY valid JSON matching this schema:

{
  "questions": [
    {
      "id": "generate-a-short-random-unique-id",
      "type": "MCQ" | "MSQ",
      "question_text": "Question text",
      "options": [
        "Choice A",
        "Choice B",
        "Choice C",
        "Choice D"
      ],
      "correct_answers": [
        "Exact option text"
      ]
    }
  ]
}
`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: systemInstructionSchema,
            },
            {
              role: 'user',
              content: `Analyze this reference material and generate assessment questions:\n\n${context}`,
            },
          ],
          response_format: {
            type: 'json_object',
          },
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const errorPayload = await response.text();
      throw new Error(
        `Groq API Error: ${errorPayload}`
      );
    }

    const groqRawData = await response.json();

    const jsonStringOutput =
      groqRawData.choices[0].message.content;

    const verifiedDataPayload =
      JSON.parse(jsonStringOutput);

    return NextResponse.json({
      questions:
        verifiedDataPayload.questions || [],
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          err.message ||
          'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}