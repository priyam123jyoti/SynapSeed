import { NextResponse } from 'next/server';

// CRITICAL: Force pure Node.js runtime
export const runtime = 'nodejs';

// Prevent static optimization
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    /**
     * IMPORTANT:
     * Use dynamic import instead of require()
     * to avoid ESLint + bundling issues
     */
    const pdfParseModule = await import('pdf-parse/lib/pdf-parse.js');

    const pdfParse =
      pdfParseModule.default || pdfParseModule;

    /**
     * Safety timeout
     */
    const data: any = await Promise.race([
      pdfParse(buffer),
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                'PDF parsing timed out.'
              )
            ),
          8000
        )
      ),
    ]);

    return NextResponse.json({
      text: data.text,
    });
  } catch (err: any) {
    console.error('PDF Parse Error:', err);

    return NextResponse.json(
      {
        error:
          err?.message ||
          'Failed to parse PDF',
      },
      { status: 500 }
    );
  }
}