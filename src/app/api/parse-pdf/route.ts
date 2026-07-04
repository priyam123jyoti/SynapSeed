import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: Request) {
  console.log("--- API: PDF Parsing Started ---");
  
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.error("API Error: No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File received:", file.name, "Size:", file.size);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Buffer created, length:", buffer.length);

    const text = await new Promise((resolve, reject) => {
      // Initialize with default configuration
      const pdfParser = new (PDFParser as any)();

      pdfParser.on("pdfParser_dataError", (err: any) => {
        console.error("PDF Parsing Library Error:", err);
        reject(err);
      });
      
      pdfParser.on("pdfParser_dataReady", () => {
        console.log("PDF Parsing Successful");
        resolve(pdfParser.getRawTextContent());
      });

      console.log("Invoking parseBuffer...");
      pdfParser.parseBuffer(buffer);
    });

    console.log("--- API: Parsing Finished ---");
    return NextResponse.json({ text });

  } catch (err: any) {
    console.error("--- API: Parsing Error ---", err);
    return NextResponse.json(
      { error: err.message || "Failed to parse PDF" }, 
      { status: 500 }
    );
  }
}