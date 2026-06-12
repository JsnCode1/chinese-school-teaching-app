import { createClient } from "@supabase/supabase-js";

// These values come from your .env.local file.
// They are safe to expose because they use the public anon key.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Check .env.local.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
