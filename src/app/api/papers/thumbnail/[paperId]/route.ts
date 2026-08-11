import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;
    const supabase = await createClient();

    // 1. Fetch thumbnail_path from DB using paperId
    const { data: paper, error: dbError } = await supabase
      .from('papers')
      .select('thumbnail_path')
      .eq('id', paperId)
      .single();

    if (dbError || !paper?.thumbnail_path) {
      return NextResponse.json({ error: 'Thumbnail not found' }, { status: 404 });
    }

    // 2. Fetch thumbnail file buffer from Supabase Storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from('paper-thumbnails')
      .download(paper.thumbnail_path);

    if (storageError || !fileData) {
      return NextResponse.json({ error: 'Failed to retrieve image file' }, { status: 404 });
    }

    // 3. Return image response with cache headers
    const arrayBuffer = await fileData.arrayBuffer();
    const contentType = fileData.type || 'image/png';

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    console.error('Thumbnail API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}