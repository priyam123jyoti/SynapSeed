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

// Get total paper sales
const { count: totalSales, error: salesError } = await supabase
  .from('wallet_ledger')
  .select('*', {
    count: 'exact',
    head: true,
  })
  .eq('user_id', user.id)
  .eq('transaction_type', 'paper_sale');

if (salesError) {
  throw salesError;
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

const { data: recentSales, error: recentSalesError } = await supabase
  .from('wallet_ledger')
  .select(`
    amount,
    created_at,
    papers (
      course_title
    )
  `)
  .eq('user_id', user.id)
  .eq('transaction_type', 'paper_sale')
  .order('created_at', { ascending: false })
  .limit(5);

if (recentSalesError) {
  throw recentSalesError;
}

return NextResponse.json({
  stats: {
    walletBalance: Number(profile.wallet_balance),
    lifetimeEarnings,
    uploadedPapers: uploadedPapers ?? 0,
    totalSales: totalSales ?? 0,
  },

  recentSales,
});

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}