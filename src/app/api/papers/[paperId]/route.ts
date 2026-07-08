//src/app/api/papers/[paperId]/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Type context params as a Promise
export async function GET(
  req: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  try {
    // Await the asynchronous params object before extracting the ID
    const { paperId } = await params;
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication challenge failed' }, { status: 401 });
    }

    // 1. Fetch metadata and check structural ledger configuration
    const { data: paper, error: paperError } = await supabase
      .from('papers')
      .select('file_path, uploader_id')
      .eq('id', paperId)
      .single();

    if (paperError || !paper) {
      return NextResponse.json({ error: 'Target question paper entity missing.' }, { status: 404 });
    }

    // 2. Allow bypass parameters if the requester is the authentic author/uploader
    if (paper.uploader_id !== user.id) {
      const { data: unlock } = await supabase
        .from('paper_unlocks')
        .select('id')
        .eq('user_id', user.id)
        .eq('paper_id', paperId)
        .single();

      if (!unlock) {
        return NextResponse.json({ error: 'Payment clearance balance mismatch access barrier.' }, { status: 403 });
      }
    }

    // 3. Issue a secure, 60-second time-locked cryptographic signed retrieval URL
    const { data: storageData, error: storageError } = await supabase.storage
      .from('secure-papers')
      .createSignedUrl(paper.file_path, 60);

    if (storageError || !storageData) {
      return NextResponse.json({ error: 'Vault file retrieval execution failure.' }, { status: 500 });
    }

    return NextResponse.json({
      signedUrl: storageData.signedUrl,
      identity: user.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}