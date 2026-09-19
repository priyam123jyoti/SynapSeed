import { NextResponse } from 'next/server';
import { generateMoanaQuiz } from '@/services/moanaAI';

export async function POST(req: Request) {
  try {
    const { topic, subject } = await req.json();

    console.log("🧠 API RECEIVED:", { topic, subject });

    if (!topic || !subject) {
      return NextResponse.json(
        { error: 'Both "topic" and "subject" parameters are required.' },
        { status: 400 }
      );
    }

    const questions = await generateMoanaQuiz(topic, subject);

    // Safeguard: Ensure questions were generated successfully
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate questions from AI service. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('API /api/quiz ERROR:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}