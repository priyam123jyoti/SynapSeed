//src/app/api/checkout/webhook/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const signature =
      request.headers.get('x-razorpay-signature');

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_WEBHOOK_SECRET!
      )
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        {
          error: 'Invalid signature',
        },
        {
          status: 400,
        }
      );
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {

      const payment = event.payload.payment.entity;

      const userId = payment.notes?.user_id;

      if (!userId) {
        return NextResponse.json(
          {
            error: 'Missing user_id',
          },
          {
            status: 400,
          }
        );
      }

      const processed =
        await supabaseAdmin.rpc(
          'process_wallet_payment',
          {
            p_user_id: userId,
            p_payment_id: payment.id,
            p_order_id: payment.order_id,
            p_amount: payment.amount / 100,
          }
        );

      if (processed.error) {

        console.error(processed.error);

        return NextResponse.json(
          {
            error: processed.error.message,
          },
          {
            status: 500,
          }
        );
      }

      if (!processed.data) {

        console.log(
          'Duplicate payment ignored.'
        );

      }

    }

    return NextResponse.json({
      success: true,
    });

  } catch (err:any) {

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}