// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://pgajyljliehhfxmbhvnx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYWp5bGpsaWVoaGZ4bWJodm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTc3NDQsImV4cCI6MjA3MTUzMzc0NH0.-2qqzzOmFeor3QwofbULz4-24Uo-CroWfio2c9Z6mLc"
);