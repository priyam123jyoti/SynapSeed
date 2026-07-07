//src/app/api/user/profile-wallet/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ wallet_balance: 0 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ wallet_balance: 0 });
    }

    return NextResponse.json({ wallet_balance: profile.wallet_balance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}