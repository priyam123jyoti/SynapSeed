import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/supabase';

// Helper function to initialize the modern Supabase SSR client for Next.js 15 Route Handlers
async function getSupabaseAuthClient() {
  const cookieStore = await cookies(); // In Next.js 15, cookies() must be awaited

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The setAll method was called from a Server Component middleware track.
            // This can be safely ignored if you have auth middleware refreshing sessions.
          }
        },
      },
    }
  );
}

// --- POST: CREATE NEW ASSESSMENT MATRIX WITH USER PROFILE BUNDLED ---
export async function POST(req: Request) {
  try {
    // 1. Authenticate the incoming request session via the SSR client
    const supabaseAuth = await getSupabaseAuthClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized credentials session.' }, { status: 401 });
    }

    // 2. Fetch the creator's onboarded profile info using your admin bypass client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('username, institution')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile configuration missing. Please complete identity onboarding.' }, 
        { status: 403 }
      );
    }

    // 3. Parse incoming quiz data array payload
    const { title, description, questions } = await req.json();

    if (!title || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'Incomplete evaluation data matrix.' }, { status: 400 });
    }

    // 4. Insert directly into 'tests' table matching your exact Test Hub schema
    const { data: testData, error: testErr } = await supabaseAdmin
      .from('tests')
      .insert([
        { 
          title, 
          description, 
          status: 'PUBLISHED',
          
          // Connected Profile Fields injected safely on the backend
          creator_id: user.id,
          creator_name: profile.username || 'Anonymous Faculty',
          creator_college: profile.institution || 'Dhakuakhana College Affiliate',
          creator_avatar: null
        }
      ])
      .select()
      .single();

    if (testErr) throw testErr;

    // 5. Structure relational transaction rows for the separate 'questions' table
    const formattedQuestionsPayload = questions.map((q: any) => ({
      test_id: testData.id,
      type: q.type,
      question_text: q.question_text,
      options: q.options,
      correct_answers: q.correct_answers
    }));

    const { error: questionsErr } = await supabaseAdmin
      .from('questions')
      .insert(formattedQuestionsPayload);

    if (questionsErr) throw questionsErr;

    return NextResponse.json({ success: true, testId: testData.id });
  } catch (err: any) {
    console.error("Compilation submission error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- GET: FETCH RELEVANT ASSESSMENTS FOR THE INSTRUCTOR DASHBOARD ---
export async function GET() {
  try {
    // Authenticate user session to isolate dashboard logs
    const supabaseAuth = await getSupabaseAuthClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized token reference.' }, { status: 401 });
    }

    // Pull tests filtered strictly by the current creator's session ID
    const { data: robustTests, error: robustErr } = await supabaseAdmin
      .from('tests')
      .select('id, title, description, created_at, questions(id)')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (robustErr) throw robustErr;

    // Format fields perfectly matching your frontend 'TestSummary' component interface
    const formattedTests = (robustTests || []).map((test: any) => ({
      id: test.id,
      title: test.title,
      description: test.description,
      created_at: test.created_at,
      question_count: Array.isArray(test.questions) ? test.questions.length : 0 
    }));

    return NextResponse.json({ tests: formattedTests });
    
  } catch (err: any) {
    console.error("Fetch error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}