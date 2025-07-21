import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase client for client-side operations
 * Following Single Responsibility Principle - handles only client creation
 */
export const createClient = () =>
  createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  })

/**
 * Type-safe wrapper for Supabase client
 * Ensures proper typing throughout the application
 */
export type SupabaseClient = ReturnType<typeof createClient>