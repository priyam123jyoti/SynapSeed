import { NextResponse } from 'next/server';

interface Question {
  id: string;
  type: 'MCQ' | 'MSQ';
  question_text: string;
  options: string[];
  correct_answers: string[];
}

const GROQ_MODEL = 'openai/gpt-oss-20b';

function cleanJsonResponse(content: string): string {
  let cleaned = content.trim();

  // Remove ```json ... ``` or ``` ... ```
  cleaned = cleaned
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Extra protection if the model adds text before/after the JSON object.
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

function extractGroqError(raw: string): string {
  try {
    const parsed = JSON.parse(raw);

    return (
      parsed?.error?.message ||
      parsed?.message ||
      raw ||
      'Unknown Groq API error.'
    );
  } catch {
    return raw || 'Unknown Groq API error.';
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const context: string = String(body.context ?? '');

    // IMPORTANT:
    // Frontend currently sends "count".
    // Also support "desiredQuestionCount" for compatibility.
    const requestedCount =
      Number(body.count ?? body.desiredQuestionCount) || 20;

    const safeQuestionCount = Math.max(
      1,
      Math.min(requestedCount, 30)
    );

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Groq API Key is missing.',
          code: 'MISSING_GROQ_API_KEY',
        },
        { status: 500 }
      );
    }

    if (!context.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Study material is required.',
          code: 'EMPTY_CONTEXT',
        },
        { status: 400 }
      );
    }

    if (context.length > 40000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum context size is 40,000 characters.',
          code: 'CONTEXT_TOO_LARGE',
        },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are an expert academic assessment paper generator.

Generate high-quality examination questions ONLY from the supplied study material.

QUESTION TYPES:

1. MCQ
- Exactly 4 options.
- Exactly ONE correct answer.

2. MSQ
- Exactly 4 options.
- One or more correct answers.

Never generate:
- Fill in the Blank
- True / False
- Essay
- Short Answer
- Matching
- Ordering
- Any other question type

QUESTION COUNT:

Generate approximately ${safeQuestionCount} questions.

If the supplied material is too small to support that many high-quality questions,
generate fewer rather than inventing information.

Never invent facts that are not supported by the supplied material.

QUALITY:

- Cover different parts of the supplied material.
- Avoid duplicate questions.
- Avoid duplicate options.
- Include conceptual and factual questions where appropriate.
- Questions must be academically meaningful.
- Every question must be answerable from the supplied material.

JSON REQUIREMENT:

Return ONLY a JSON object.

The response must have exactly this structure:

{
  "questions": [
    {
      "id": "unique-id",
      "type": "MCQ",
      "question_text": "Question text",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
      ],
      "correct_answers": [
        "Option 1"
      ]
    }
  ]
}

Do NOT use Markdown.
Do NOT use code fences.
Do NOT write explanations outside the JSON object.
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
          model: GROQ_MODEL,

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

    // --------------------------------------------------
    // GROQ HTTP ERROR
    // --------------------------------------------------

    if (!response.ok) {
      const rawError = await response.text();
      const groqError = extractGroqError(rawError);

      console.error('❌ GROQ API ERROR:', {
        status: response.status,
        model: GROQ_MODEL,
        error: groqError,
      });

      return NextResponse.json(
        {
          success: false,
          error: groqError,
          code: 'GROQ_API_ERROR',
          status: response.status,
          model: GROQ_MODEL,
        },
        { status: 502 }
      );
    }

    // --------------------------------------------------
    // GROQ RESPONSE
    // --------------------------------------------------

    const groq = await response.json();

    const rawContent =
      groq?.choices?.[0]?.message?.content;

    if (!rawContent || typeof rawContent !== 'string') {
      console.error('❌ GROQ EMPTY RESPONSE:', groq);

      return NextResponse.json(
        {
          success: false,
          error: 'Groq returned an empty response.',
          code: 'EMPTY_GROQ_RESPONSE',
          model: GROQ_MODEL,
        },
        { status: 502 }
      );
    }

    console.log(
      '🤖 GROQ RAW RESPONSE:',
      rawContent.substring(0, 2000)
    );

    // --------------------------------------------------
    // CLEAN MARKDOWN FENCES
    // --------------------------------------------------

    const cleanedContent =
      cleanJsonResponse(rawContent);

    // --------------------------------------------------
    // JSON PARSE
    // --------------------------------------------------

    let parsed: any;

    try {
      parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('❌ GROQ JSON PARSE ERROR:', {
        parseError,
        rawContent,
        cleanedContent,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Groq returned invalid JSON.',
          code: 'INVALID_JSON',
          model: GROQ_MODEL,
          rawPreview: rawContent.substring(0, 1000),
        },
        { status: 502 }
      );
    }

    // --------------------------------------------------
    // QUESTION VALIDATION
    // --------------------------------------------------

    const questions: Question[] = Array.isArray(parsed?.questions)
      ? parsed.questions
          .filter((q: any) => {
            return (
              q &&
              (q.type === 'MCQ' || q.type === 'MSQ') &&
              typeof q.question_text === 'string' &&
              Array.isArray(q.options) &&
              q.options.length === 4 &&
              Array.isArray(q.correct_answers) &&
              q.correct_answers.length > 0
            );
          })
          .map((q: any) => ({
            id:
              typeof q.id === 'string' && q.id.trim()
                ? q.id
                : crypto.randomUUID(),

            type: q.type,

            question_text: q.question_text.trim(),

            options: q.options.map((option: unknown) =>
              String(option).trim()
            ),

            correct_answers: q.correct_answers.map(
              (answer: unknown) => String(answer).trim()
            ),
          }))
      : [];

    if (questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Groq returned JSON, but no valid questions were found.',
          code: 'NO_VALID_QUESTIONS',
          model: GROQ_MODEL,
        },
        { status: 502 }
      );
    }

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return NextResponse.json({
      success: true,
      requestedQuestions: safeQuestionCount,
      generatedQuestions: questions.length,
      model: GROQ_MODEL,
      questions,
    });

  } catch (error) {
    console.error(
      '❌ /api/generate-questions INTERNAL ERROR:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error.',
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}