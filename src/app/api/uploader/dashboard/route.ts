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

return NextResponse.json({
  walletBalance: profile.wallet_balance,
});

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}