import { createClient } from '@supabase/supabase-js';

// Next.js uses process.env instead of import.meta.env
// The NEXT_PUBLIC_ prefix makes these available in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In development, this helps you catch missing variables early
  console.error('Supabase URL or Anon Key is missing in environment variables.');
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

// Optional: Debugging logs (will show in browser console)
if (process.env.NODE_ENV === 'development') {
    console.log("Supabase initialized with URL:", supabaseUrl);
}