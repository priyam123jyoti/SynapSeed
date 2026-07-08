import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized configuration' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amountAdded } = await request.json();

    // 1. Re-verify the signature from Razorpay to prevent transaction spoofing
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Cryptographic signature mismatch. Transaction untrusted.' }, { status: 400 });
    }

    // 2. Safely credit funds using your database definer RPC function
    const { error } = await supabase.rpc('increment_wallet_balance', {
      p_user_id: user.id,
      p_amount: Number(amountAdded)
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Wallet balance successfully settled.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}