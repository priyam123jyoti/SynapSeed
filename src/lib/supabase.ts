import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. Standard Client (For Frontend / Student view)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-anon-key'
);

// 2. Admin Client (For Server-Side API Routes Only)
// We add a dummy string fallback so the browser doesn't crash when importing this file!
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'dummy-key-to-prevent-browser-crash',
  {
    auth: { persistSession: false }
  }
);

if (process.env.NODE_ENV === 'development') {
  console.log("Supabase clients initialized successfully.");
}