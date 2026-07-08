//src/app/api/user/razorpay-order/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized login required' }, { status: 401 });
    }

    const { amount } = await request.json(); // e.g., ₹50
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid currency amount specification' }, { status: 400 });
    }

    // Razorpay operates entirely in paisa denominations (₹1 = 100 paise)
    const options = {
      amount: Math.round(amount * 100), 
      currency: 'INR',
      receipt: `receipt_wallet_${user.id.slice(0, 8)}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}