import { NextResponse } from 'next/server';

interface Question {
  id: string;
  type: 'MCQ' | 'MSQ';
  question_text: string;
  options: string[];
  correct_answers: string[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const context: string = body.context ?? '';

    // New field (optional)
    const desiredQuestionCount: number =
      Number(body.desiredQuestionCount) || 20;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Groq API Key is missing.',
        },
        {
          status: 500,
        }
      );
    }

    if (!context.trim()) {
      return NextResponse.json(
        {
          error: 'Study material is required.',
        },
        {
          status: 400,
        }
      );
    }

    if (context.length > 40000) {
      return NextResponse.json(
        {
          error:
            'Maximum context size is 40,000 characters.',
        },
        {
          status: 400,
        }
      );
    }

    const safeQuestionCount = Math.max(
      1,
      Math.min(desiredQuestionCount, 100)
    );

    const systemPrompt = `
You are an expert assessment paper generator.

Your job is to carefully read the supplied study material and generate high-quality examination questions.

========================
QUESTION TYPES ALLOWED
========================

Generate ONLY:

1. MCQ
- Exactly 4 options
- Exactly ONE correct answer

2. MSQ
- Exactly 4 options
- One or more correct answers

Never generate:

- Fill in the Blank
- True / False
- Essay
- Short Answer
- Matching
- Ordering
- Any other question type

========================
QUESTION COUNT
========================

The user would LIKE approximately ${safeQuestionCount} questions.

This is NOT mandatory.

Generate as many high-quality questions as reasonably possible from the material.

If the study material is small,
generate fewer.

If the study material is large,
generate close to ${safeQuestionCount}.

Never invent facts that are not present.

Avoid duplicate questions.

Cover as many different topics as possible.

========================
QUALITY RULES
========================

Questions should:

- cover the entire document
- avoid repetition
- vary in difficulty
- include conceptual questions
- include factual questions
- include application questions where possible

========================
JSON FORMAT
========================

Return ONLY JSON.

{
  "questions":[
    {
      "id":"unique-id",
      "type":"MCQ",
      "question_text":"...",
      "options":[
        "...",
        "...",
        "...",
        "..."
      ],
      "correct_answers":[
        "..."
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

          temperature: 0.3,

          response_format: {
            type: 'json_object',
          },

          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: context,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();

      throw new Error(error);
    }

    const groq = await response.json();

    const rawContent =
      groq.choices?.[0]?.message?.content ?? '{}';

    const parsed = JSON.parse(rawContent);

    const questions: Question[] = Array.isArray(parsed.questions)
      ? parsed.questions
      : [];

    return NextResponse.json({
      requestedQuestions: safeQuestionCount,
      generatedQuestions: questions.length,
      questions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error.',
      },
      {
        status: 500,
      }
    );
  }
}