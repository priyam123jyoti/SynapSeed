//src/app/api/papers/stream/[paperId]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    //-------------------------------------------------------
    // Fetch paper
    //-------------------------------------------------------

    const { data: paper, error: paperError } = await supabase
      .from('papers')
      .select('file_path,uploader_id')
      .eq('id', paperId)
      .single();

    if (paperError || !paper) {
      return new NextResponse('Paper not found', { status: 404 });
    }

    //-------------------------------------------------------
    // Owner always has access
    //-------------------------------------------------------

    let hasAccess = paper.uploader_id === user.id;

    //-------------------------------------------------------
    // Purchased?
    //-------------------------------------------------------

    if (!hasAccess) {
      const { data: unlock } = await supabase
        .from('paper_unlocks')
        .select('id')
        .eq('paper_id', paperId)
        .eq('user_id', user.id)
        .maybeSingle();

      hasAccess = !!unlock;
    }

    if (!hasAccess) {
      return new NextResponse('Access denied', {
        status: 403,
      });
    }

    //-------------------------------------------------------
    // Download directly from private bucket
    //-------------------------------------------------------

    const { data, error } = await supabaseAdmin.storage
      .from('secure-papers')
      .download(paper.file_path);

    if (error || !data) {
      return new NextResponse('Unable to load paper', {
        status: 500,
      });
    }

    //-------------------------------------------------------
    // Detect content type
    //-------------------------------------------------------

    const contentType =
      data.type || 'application/octet-stream';

    //-------------------------------------------------------
    // Return file
    //-------------------------------------------------------

    return new NextResponse(data.stream(), {
      headers: {
        'Content-Type': contentType,

        // Prevent browser download
        'Content-Disposition': 'inline',

        // Prevent caching
        'Cache-Control': 'no-store',

        // Prevent MIME sniffing
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: any) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
}