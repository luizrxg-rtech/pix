'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@/lib/supabase/client'

/**
 * Custom hook for Supabase client
 * Following Single Responsibility Principle - manages only Supabase client state
 */
export function useSupabase(): SupabaseClient {
  const [client] = useState(() => createClient())
  
  return client
}

/**
 * Custom hook for real-time subscriptions
 * Handles subscription lifecycle and cleanup
 */
export function useSupabaseSubscription(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) {
  const supabase = useSupabase()
  
  useEffect(() => {
    let subscription: any
    
    const setupSubscription = async () => {
      const channel = supabase.channel(`${table}_changes`)
      
      subscription = channel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter,
          },
          callback
        )
        .subscribe()
    }
    
    setupSubscription()
    
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [supabase, table, callback, filter])
}