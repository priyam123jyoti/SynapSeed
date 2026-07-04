import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the PDF using a promise wrapper for async/await support
    const text = await new Promise((resolve, reject) => {
      const pdfParser = new (PDFParser as any)();

      pdfParser.on("pdfParser_dataError", (err: any) => reject(err));
      pdfParser.on("pdfParser_dataReady", () => {
        // This extracts the raw text content from the PDF structure
        resolve(pdfParser.getRawTextContent());
      });

      pdfParser.parseBuffer(buffer);
    });

    return NextResponse.json({ text });

  } catch (err: any) {
    console.error("PDF Parsing Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to parse PDF" }, 
      { status: 500 }
    );
  }
}