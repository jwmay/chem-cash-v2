import { createClient, SupabaseClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    __supabase?: SupabaseClient
    __supabaseAdmin?: SupabaseClient
  }
}

function getSupabaseClient() {
  if (typeof window !== 'undefined' && window.__supabase) {
    return window.__supabase
  }
  const client = createClient(
    import.meta.env.VITE_SUPABASE_DATABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  )
  if (typeof window !== 'undefined') {
    window.__supabase = client
  }
  return client
}

function getSupabaseAdminClient() {
  if (typeof window !== 'undefined' && window.__supabaseAdmin) {
    return window.__supabaseAdmin
  }
  const client = createClient(
    import.meta.env.VITE_SUPABASE_DATABASE_URL,
    import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        storageKey: 'sb-admin-auth-token',
      },
    },
  )
  if (typeof window !== 'undefined') {
    window.__supabaseAdmin = client
  }
  return client
}

export const supabase = getSupabaseClient()
export const supabaseAdmin = getSupabaseAdminClient()
