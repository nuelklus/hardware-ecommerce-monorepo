// Supabase Configuration
// Update these values with your Supabase project details

export const SUPABASE_CONFIG = {
  url: 'https://xachljqxtnhnmbpcnymt.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'
}

// Validate configuration
export function validateSupabaseConfig() {
  if (!SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.anonKey === 'your-anon-key-here') {
    throw new Error(
      'Supabase anon key not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables or update config/supabase.ts'
    )
  }
  return SUPABASE_CONFIG
}
