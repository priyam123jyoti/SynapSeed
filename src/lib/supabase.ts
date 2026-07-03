import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Added for server-side use

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing in environment variables.');
}

// 1. Standard Client (For Frontend / Student view)
// This respects Row Level Security (RLS)
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

// 2. Admin Client (For Server-Side API Routes Only)
// This uses the secret key to bypass RLS for grading and publishing tests
export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: { persistSession: false } // Prevents the server from mixing up user sessions
  }
);

if (process.env.NODE_ENV === 'development') {
  console.log("Supabase clients initialized successfully.");
}