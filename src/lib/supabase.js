import { createClient } from '@supabase/supabase-js'
import { mockSupabase } from './mockSupabase'

// Quand VITE_MOCK_MODE=true dans .env.local, on utilise le mock local
// sans avoir besoin d'un projet Supabase.
if (import.meta.env.VITE_MOCK_MODE !== 'true') {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    )
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  import.meta.env.VITE_MOCK_MODE === 'true'
    ? mockSupabase
    : createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key'
      )
