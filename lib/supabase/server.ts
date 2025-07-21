import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Creates a Supabase client for server-side operations
 * Following Single Responsibility Principle - handles only server client creation
 */
export const createServerClient = () =>
  createServerComponentClient<Database>({ 
    cookies,
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  })

/**
 * Type-safe wrapper for Supabase server client
 * Ensures proper typing throughout the application
 */
export type SupabaseServerClient = ReturnType<typeof createServerClient>