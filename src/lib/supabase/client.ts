import { createClient } from "@supabase/supabase-js";

// Values come from .env when set (see .env.example). The fallbacks below are
// the project's public publishable/anon keys, which are safe to ship in
// client code by design.
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://seilaswjzerlycvqrwxz.supabase.co";
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlaWxhc3dqemVybHljdnFyd3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODc3MjgsImV4cCI6MjEwODM2MzcyOH0.I8TjURQOXsoVjEpKwvscugjZZzCyoqSne7Wx0KJL5FM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);