import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use on the server (e.g. inside Server Actions).
 *
 * It uses the publishable key, so every request is still subject to the
 * database's Row Level Security policies. The `customers` table only exposes an
 * INSERT policy to the `anon` role, which is exactly what the enquiry form needs
 * — no read access is granted, keeping submitted enquiries private.
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local (see .env.example)."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
