import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. Standard Client (Upgraded to SSR Browser Client)
// This automatically syncs and sets the 'sb-' cookies your backend was missing!
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

// 2. Admin Client (For Server-Side API Routes Only)
// Remains unchanged since server-to-server admin bypass doesn't use browser cookies.
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || 'dummy-key-to-prevent-browser-crash',
  {
    auth: { persistSession: false }
  }
);

if (process.env.NODE_ENV === 'development') {
  console.log("Supabase SSR & Admin clients initialized successfully.");
}