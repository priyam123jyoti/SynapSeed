// src/app/api/papers/[paperId]/route.ts

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    const { paperId } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
    }

    //------------------------------------------------------
    // Fetch paper
    //------------------------------------------------------

    const { data: paper, error: paperError } = await supabase
      .from('papers')
      .select('file_path, uploader_id')
      .eq('id', paperId)
      .single();

    if (paperError || !paper) {
      return NextResponse.json(
        { error: 'Paper not found.' },
        { status: 404 }
      );
    }

    //------------------------------------------------------
    // Owner always has access
    //------------------------------------------------------

    let hasAccess = paper.uploader_id === user.id;

    //------------------------------------------------------
    // Check purchase
    //------------------------------------------------------

    if (!hasAccess) {
      const { data: unlock } = await supabase
        .from('paper_unlocks')
        .select('id')
        .eq('user_id', user.id)
        .eq('paper_id', paperId)
        .maybeSingle();

      hasAccess = !!unlock;
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You have not purchased this paper.' },
        { status: 403 }
      );
    }

    //------------------------------------------------------
    // Detect file type
    //------------------------------------------------------

    const extension =
      paper.file_path.split('.').pop()?.toLowerCase() || '';

    const isPdf = extension === 'pdf';

    //------------------------------------------------------
    // Return metadata only
    //------------------------------------------------------

    return NextResponse.json({
      identity: user.email,
      isPdf,
      streamUrl: `/api/papers/stream/${paperId}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}