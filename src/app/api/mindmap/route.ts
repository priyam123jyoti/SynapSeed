import { NextResponse } from 'next/server';
import { generateMindMap } from '@/services/moanaAI';

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();

    if (!rawText) {
      return NextResponse.json(
        { error: 'rawText parameter is required' },
        { status: 400 }
      );
    }

    const result = await generateMindMap(rawText);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/mindmap ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}