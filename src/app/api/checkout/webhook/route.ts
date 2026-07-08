import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Initialize a privileged direct bypass instance to handle background updates safely
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Kept safe strictly on server systems
);

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!; // Set this key inside your dashboard configuration panels

    // 1. Verify that this incoming post message originates genuinely from Razorpay
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyText)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Signature handshake failure.' }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    // 2. Process wallet top-ups on successful payment capture loops
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;

      // Pull up the initial order description metadata logs to check amount properties
      // Note: Parse out your User ID from notes or target ledger links
      const receiptString = paymentEntity.description || ''; 
      
      // If you pass user identity parameters inside notes objects:
      const userId = paymentEntity.notes?.user_id;
      const creditValue = paymentEntity.amount / 100; // Convert back to standard Rupees value

      if (userId) {
        // Increment user's profile balance directly inside the database securely
        const { error } = await supabaseAdmin.rpc('increment_wallet_balance', {
          p_user_id: userId,
          p_amount: creditValue
        });

        if (error) console.error("Database update failure:", error);
      }
    }

    return NextResponse.json({ status: 'Handshake complete' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}