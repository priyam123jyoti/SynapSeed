import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Convert the uploaded file into a Buffer for pdf-parse
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);

    // Extract text and enforce the 40,000 character limit
    const extractedText = pdfData.text.trim().substring(0, 40000);

    return NextResponse.json({ text: extractedText });
  } catch (err: any) {
    return NextResponse.json({ error: `PDF Parsing Failed: ${err.message}` }, { status: 500 });
  }
}