import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Dynamically import the legacy CJS module at runtime
    // This resolves the "Export default doesn't exist" build error
    const pdfParse = (await import('pdf-parse')).default || await import('pdf-parse');

    // Get the file buffer from the request
    const data = await req.arrayBuffer();
    const buffer = Buffer.from(data);

    // Parse the PDF
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