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
    // Get total uploaded papers
const { count: uploadedPapers, error: uploadError } = await supabase
  .from('papers')
  .select('*', { count: 'exact', head: true })
  .eq('uploader_id', user.id);

if (uploadError) {
  throw uploadError;
}


    // We will continue from here...

 // Get wallet balance
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('wallet_balance')
  .eq('id', user.id)
  .single();

if (profileError) {
  throw profileError;
}

// Get lifetime earnings from paper sales
const { data: earnings, error: earningsError } = await supabase
  .from('wallet_ledger')
  .select('amount')
  .eq('user_id', user.id)
  .eq('transaction_type', 'paper_sale');

if (earningsError) {
  throw earningsError;
}

const lifetimeEarnings = earnings.reduce(
  (total, row) => total + Number(row.amount),
  0
);

return NextResponse.json({
  walletBalance: Number(profile.wallet_balance),
  lifetimeEarnings,
  uploadedPapers: uploadedPapers ?? 0,
});

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}