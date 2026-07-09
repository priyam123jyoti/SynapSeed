//src/app/api/user/razorpay-order/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { razorpayOrderRateLimit } from '@/lib/upstash';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
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

    //------------------------------------------------------
// Rate limit
//------------------------------------------------------

const { success } = await razorpayOrderRateLimit.limit(
  `razorpay-order:${user.id}`
);

if (!success) {
  return NextResponse.json(
    {
      error:
        'Too many payment order requests. Please try again later.',
    },
    {
      status: 429,
    }
  );
}
    const { amount } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `wallet_${Date.now()}`,
      notes: {
        user_id: user.id,
      },
    });

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}