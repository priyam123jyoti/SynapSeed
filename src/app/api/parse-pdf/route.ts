import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Cast to 'any' to bypass strict TS type checking for legacy modules
    const pdfParse = (await import('pdf-parse')) as any;

    // Get the file buffer from the request
    const data = await req.arrayBuffer();
    const buffer = Buffer.from(data);

    // Parse the PDF
    // We treat 'pdfParse' as the function directly (common in CJS modules)
    const parsed = await pdfParse(buffer);

    // Return the extracted text
    return NextResponse.json({ 
      text: parsed.text,
      numpages: parsed.numpages,
      info: parsed.info 
    });

  } catch (err: any) {
    console.error("PDF Parsing Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to parse PDF" }, 
      { status: 500 }
    );
  }
}