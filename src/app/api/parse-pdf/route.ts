import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Get the FormData from the request
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Convert the file to an ArrayBuffer, then a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Dynamically import and run the parser
    const pdfParse = (await import('pdf-parse')) as any;
    const parsed = await pdfParse(buffer);

    // 4. Return the results
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