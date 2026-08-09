import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

const ADMIN_EMAIL = 'dihingiapriyamjyoti@gmail.com';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Fetch paper record
    const { data: paper, error: paperError } = await supabase
      .from('papers')
      .select('file_path, uploader_id')
      .eq('id', paperId)
      .single();

    if (paperError || !paper) {
      return new NextResponse('Paper not found', { status: 404 });
    }

    // 3. Check Access Hierarchy: Admin -> Uploader -> Purchase
    const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL;
    const isOwner = paper.uploader_id === user.id;

    let hasAccess = isAdmin || isOwner;

    // Check purchase status if not Admin/Owner
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
      return new NextResponse('Access denied', { status: 403 });
    }

    // 4. Download file from private bucket using admin client
    const { data, error } = await supabaseAdmin.storage
      .from('secure-papers')
      .download(paper.file_path);

    if (error || !data) {
      return new NextResponse('Unable to load paper from storage', { status: 500 });
    }

    const contentType = data.type || 'application/pdf';

    return new NextResponse(data.stream(), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: any) {
    return new NextResponse(err.message || 'Internal Server Error', {
      status: 500,
    });
  }
}