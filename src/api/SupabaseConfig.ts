// src/api/SupabaseConfig.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fnebbnzlxruuvlsiyphd.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuZWJibnpseHJ1dXZsc2l5cGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTIyMDQsImV4cCI6MjA5MjgyODIwNH0.4yABwMha95nsGMhGv50SIP1b9tvjisvZVuspdpSnq6g";

//NEXT_PUBLIC_SUPABASE_URL=https://fnebbnzlxruuvlsiyphd.supabase.co

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
