"use client";

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  
  // This ref prevents the useEffect from running twice in React Strict Mode
  const processingRef = useRef(false);

  useEffect(() => {
    async function handleAuth() {
      if (processingRef.current) return;
      processingRef.current = true;

      try {
        // Get the current session from Google
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        const user = session?.user;

        if (!user) {
          router.push('/onboarding');
          return;
        }

        // 1. THE "RETURNING LEGEND" CHECK
        // See if they already exist and have completed onboarding
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('has_onboarded')
          .eq('id', user.id)
          .maybeSingle();

        if (existingProfile?.has_onboarded) {
          localStorage.removeItem('synapseed_buffer'); // Clean up memory
          router.push('/profile');
          return;
        }

        // 2. THE "NEW RECRUIT" CHECK
        // Get the data they filled out in the Onboarding Wizard
        const bufferRaw = localStorage.getItem('synapseed_buffer');
        if (!bufferRaw) {
          // If no data is found, they skipped the form. Send them back.
          router.push('/onboarding');
          return;
        }

        const buffer = JSON.parse(bufferRaw);

        // 3. THE FINAL SYNC
        // Push the buffered data into your Supabase database
        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          username: buffer.username,
          phone: buffer.phone || null,
          occupation: buffer.occupation || null,
          institution: buffer.institution || null,
          // CRITICAL: This exact key maps perfectly to your SQL column
          is_dhakuakhana_college_autonomous: buffer.is_dhakuakhana_college_autonomous || false,
          interests: buffer.interests || [],
          bio: buffer.bio || null,
          avatar_url: buffer.avatarBase64 || null,
          has_onboarded: true, // Mark them as officially set up!
          updated_at: new Date().toISOString()
        });

        if (upsertError) {
          console.error("Neural Sync Error:", upsertError.message);
          router.push('/onboarding');
        } else {
          // Success! Clear the buffer and let them into the app
          localStorage.removeItem('synapseed_buffer');
          router.push('/profile');
        }

      } catch (err) {
        console.error("Critical Auth Error:", err);
        router.push('/onboarding');
      }
    }

    handleAuth();
  }, [router]);

  // 4. THE LIGHTWEIGHT UI
  // Built with pure Tailwind to prevent Next.js CSS preload warnings during fast redirects
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      <div className="w-10 h-10 border-[3px] border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">
        Establishing Neural Link...
      </p>
    </div>
  );
}