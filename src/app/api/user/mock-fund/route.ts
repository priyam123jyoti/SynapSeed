//src/app/api/user/mock-fund/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Safely increment profile wallet balance by credit parameter of ₹50.00
    const { data, error } = await supabase
      .from('profiles')
      .update({ wallet_balance: 50.00 }) // Sets or triggers mock testing bounds
      .eq('id', user.id)
      .select('wallet_balance')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, newBalance: data.wallet_balance });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}