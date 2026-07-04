import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    
    // TIMEOUT TRAP: Race the parser against an 8-second timer
    const data: any = await Promise.race([
      pdfParse(buffer),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("PDF Parsing Timed Out! The file is hanging the server.")), 8000)
      )
    ]);

    return NextResponse.json({ text: data.text });

  } catch (err: any) {
    console.error("API Error Caught:", err.message);
    // This guaranteed 500 error will finally stop your frontend animation
    return NextResponse.json(
      { error: err.message || "Failed to parse PDF" }, 
      { status: 500 }
    );
  }
}