import { createClient } from "@supabase/supabase-js";

// 1. Get the variables from the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Add validation to ensure they exist (optional but recommended)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in the environment variables.");
}

// 3. Create the client using the environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey);