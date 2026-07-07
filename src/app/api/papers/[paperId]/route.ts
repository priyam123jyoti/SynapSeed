import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { paperId: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication challenge failed' }, { status: 401 });
    }

    // 1. Fetch metadata and check structural ledger configuration
    const { data: paper, error: paperError } = await supabase
      .from('papers')
      .select('file_path, uploader_id')
      .eq('id', params.paperId)
      .single();

    if (paperError || !paper) {
      return NextResponse.json({ error: 'Target question paper entity missing.' }, { status: 404 });
    }

    // 2. Allow bypass parameters if the requester is the authentic author/uploader
    if (paper.uploader_id !== user.id) {
      // Otherwise enforce checking purchase verification index schema
      const { data: unlock } = await supabase
        .from('paper_unlocks')
        .select('id')
        .eq('user_id', user.id)
        .eq('paper_id', params.paperId)
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

    // 4. Return secure link and identity verification criteria properties to client browser
    return NextResponse.json({
      signedUrl: storageData.signedUrl,
      identity: user.email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}