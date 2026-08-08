declare module 'pdf-parse/lib/pdf-parse.js' {
  const pdfParse: (
    dataBuffer: Buffer
  ) => Promise<{
    text: string;
    numpages: number;
    info: unknown;
    metadata: unknown;
    version: string;
  }>;

  export default pdfParse;
}