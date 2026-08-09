import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'dihingiapriyamjyoti@gmail.com';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;
    const supabase = await createClient();

    // ------------------------------------------------------------------
    // CHECK 1: Authenticate User Session
    // ------------------------------------------------------------------
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('[STREAM_ERR] 401 Unauthorized: Session missing or invalid.', userError?.message);
      return new NextResponse('Unauthorized: Please log in again.', { status: 401 });
    }

    const currentEmail = user.email?.trim().toLowerCase() || '';
    console.log(`[STREAM_LOG] User authenticated: ${currentEmail} (ID: ${user.id})`);

    // ------------------------------------------------------------------
    // CHECK 2: Fetch Paper Record (Select * to handle schema variations)
    // ------------------------------------------------------------------
    const { data: paper, error: paperError } = await supabase
      .from('papers')
      .select('*')
      .eq('id', paperId)
      .maybeSingle();

    if (paperError || !paper) {
      console.error('[STREAM_ERR] 404 Paper Not Found:', paperError?.message);
      return new NextResponse(`Paper not found: ${paperError?.message || 'Invalid ID'}`, { status: 404 });
    }

    // ------------------------------------------------------------------
    // CHECK 3: Verify Admin / Ownership Access Hierarchy
    // ------------------------------------------------------------------
    const isAdmin = currentEmail === ADMIN_EMAIL.toLowerCase();

    // Supports 'uploader_id', 'user_id', or 'uploader_email' column naming
    const isOwner =
      (paper.uploader_id && paper.uploader_id === user.id) ||
      (paper.user_id && paper.user_id === user.id) ||
      (paper.uploader_email && paper.uploader_email.toLowerCase() === currentEmail);

    let hasAccess = isAdmin || isOwner;

    console.log(`[STREAM_LOG] Access Check -> isAdmin: ${isAdmin}, isOwner: ${isOwner}`);

    // Check Purchase Table if neither Admin nor Owner
    if (!hasAccess) {
      const { data: unlock, error: unlockError } = await supabase
        .from('paper_unlocks')
        .select('id')
        .eq('paper_id', paperId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (unlockError) {
        console.error('[STREAM_ERR] Unlock Check Failed:', unlockError.message);
      }

      hasAccess = !!unlock;
      console.log(`[STREAM_LOG] Purchase Unlock Found: ${hasAccess}`);
    }

    if (!hasAccess) {
      console.error(`[STREAM_ERR] 403 Forbidden for user ${currentEmail} on paper ${paperId}`);
      return new NextResponse('Access denied: You do not have permission to view this paper.', { status: 403 });
    }

    // ------------------------------------------------------------------
    // CHECK 4: Storage Bucket Download via Admin Service Key
    // ------------------------------------------------------------------
    if (!paper.file_path) {
      console.error('[STREAM_ERR] 500: Database paper record is missing file_path');
      return new NextResponse('Paper record missing file path.', { status: 500 });
    }

    const { data, error: storageError } = await supabaseAdmin.storage
      .from('secure-papers')
      .download(paper.file_path);

    if (storageError || !data) {
      console.error('[STREAM_ERR] 500 Storage Download Failed:', storageError?.message);
      return new NextResponse(
        `Storage Download Error: ${storageError?.message || 'Check SUPABASE_SERVICE_ROLE_KEY'}`,
        { status: 500 }
      );
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
    console.error('[STREAM_ERR] Unhandled Exception:', err);
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 });
  }
}