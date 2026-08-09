import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total uploaded papers by this user
    const { count: uploadedPapers, error: uploadError } = await supabase
      .from('papers')
      .select('*', { count: 'exact', head: true })
      .eq('uploader_id', user.id);

    if (uploadError) {
      throw uploadError;
    }

    return NextResponse.json({
      stats: {
        uploadedPapers: uploadedPapers ?? 0,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}