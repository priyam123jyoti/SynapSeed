import { NextResponse } from 'next/server';
import { generateMindMap } from '@/services/moanaAI';

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();

    // Check for missing or empty/whitespace-only input
    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { error: 'rawText parameter is required and cannot be empty.' },
        { status: 400 }
      );
    }

    const result = await generateMindMap(rawText);

    // Safeguard: Check if map generation returned empty results
    if (!result || !Array.isArray(result.maps) || result.maps.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate mind map from provided text. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/mindmap ERROR:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}