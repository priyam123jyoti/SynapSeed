// src/app/api/tests/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/supabase';

async function getSupabaseAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const supabaseAuth = await getSupabaseAuthClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized credentials session.' }, { status: 401 });
    }

    // 1. Fetch profile for metadata (name, college, avatar)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ 
        error: 'Profile configuration missing.', 
        meta: {
          uid_looked_for: user.id,
          supabase_message: profileError?.message || 'No matching row found in profiles table.'
        }
      }, { status: 403 });
    }

    // 2. Parse the request payload (passcode requirement removed)
    const { title, description, questions } = await req.json();

    // 3. Normal validation checks
    if (!title || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'Incomplete evaluation data matrix.' }, { status: 400 });
    }

    // 4. Insert directly into 'tests' table (ANYONE can do this now)
    const { data: testData, error: testErr } = await supabaseAdmin
      .from('tests')
      .insert([
        { 
          title, 
          description, 
          status: 'PUBLISHED',
          creator_id: user.id,
          creator_name: profile.username || 'Anonymous User',
          creator_college: profile.institution || 'Unknown Institution',
          creator_avatar: profile.avatar_url || null
        }
      ])
      .select()
      .single();

    if (testErr) throw testErr;

    // 5. Structure relational transaction rows for 'questions' table
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabaseAuth = await getSupabaseAuthClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized token reference.' }, { status: 401 });
    }

    const { data: robustTests, error: robustErr } = await supabaseAdmin
      .from('tests')
      .select('id, title, description, created_at, questions(id)')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (robustErr) throw robustErr;

    const formattedTests = (robustTests || []).map((test: any) => ({
      id: test.id,
      title: test.title,
      description: test.description,
      created_at: test.created_at,
      question_count: Array.isArray(test.questions) ? test.questions.length : 0 
    }));

    return NextResponse.json({ tests: formattedTests });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}