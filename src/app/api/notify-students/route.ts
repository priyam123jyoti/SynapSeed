import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import webpush from 'web-push';

// 1. Initialize API Clients with Environment Verification Keys
const resend = new Resend(process.env.RESEND_API_KEY);

webpush.setVapidDetails(
  'mailto:botany-dept@dhakuakhanacollege.ac.in',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { testTitle, testLink } = await req.json();

    // =======================================================
    // STEP 1: FETCH DATA TARGETS FROM SUPABASE
    // =======================================================
    
    // A. Fetch all student profile email vectors
    // Assumes your students are registered in a 'profiles' or 'students' table
    const { data: students, error: studentError } = await supabase
      .from('profiles') 
      .select('email')
      .eq('role', 'student'); // Filters out admin profiles

    // B. Fetch active browser notification device subscriptions
    const { data: subscriptions, error: pushError } = await supabase
      .from('student_push_subscriptions')
      .select('id, subscription_json');

    if (studentError) throw studentError;

    // =======================================================
    // STEP 2: DISPATCH CUSTOM STYLED HTML EMAIL VIA RESEND
    // =======================================================
    if (students && students.length > 0) {
      // Extract emails into a single flat array string match
      const emailList = students.map((s) => s.email).filter(Boolean);

      await resend.emails.send({
        from: 'Botany Department <onboarding@resend.dev>', // Change to your verified institutional domain later
        to: emailList, 
        subject: `🚨 Academic Alert: ${testTitle} is Live!`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>New Test Assessment</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; margin: 0;">
              <div style="max-w: 550px; margin: 0 auto; bg-color: #ffffff; background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                
                <div style="background-color: #059669; padding: 32px; text-align: center;">
                  <span style="font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #a7f3d0; text-transform: uppercase;">Dhakuakhana College</span>
                  <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: -0.025em;">Botany Department</h1>
                </div>

                <div style="padding: 40px 32px;">
                  <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0; line-height: 1.3;">A new test paper has been published to your student assignment matrix.</h2>
                  
                  <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase; tracking: 0.1em;">Assessment Title</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #065f46;">${testTitle}</p>
                  </div>

                  <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin-bottom: 32px;">
                    This assessment is accessible directly through your web workspace or from the BotanyHub mobile app interface. Please ensure you complete the questions before the submission lockout.
                  </p>

                  <div style="text-align: center;">
                    <a href="${testLink}" style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; tracking: 0.1em; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.2);">
                      Launch Question Paper
                    </a>
                  </div>
                </div>

                <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="margin: 0; font-size: 10px; color: #94a3b8; font-weight: 500; letter-spacing: 0.05em;">
                    &copy; 2026 Botany Dept &bull; Dhakuakhana College Autonomous
                  </p>
                </div>

              </div>
            </body>
          </html>
        `,
      });
    }

    // =======================================================
    // STEP 3: DISPATCH BROWSER PUSH NOTIFICATIONS
    // =======================================================
    if (subscriptions && subscriptions.length > 0) {
      const pushPayload = JSON.stringify({
        title: '🚨 New Examination Live!',
        body: `Professor published: ${testTitle}`,
        url: testLink
      });

      const pushPromises = subscriptions.map((sub: any) => {
        return webpush.sendNotification(sub.subscription_json, pushPayload)
          .catch(async (err) => {
            // Self-cleaning: Delete token if student blocked notifications or reset their device browser
            if (err.statusCode === 410 || err.statusCode === 404) {
              await supabase.from('student_push_subscriptions').delete().eq('id', sub.id);
            }
          });
      });

      await Promise.all(pushPromises);
    }

    return NextResponse.json({ success: true, message: 'Dispatches complete across all active vectors.' });
  } catch (error: any) {
    console.error('System notification failure:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}