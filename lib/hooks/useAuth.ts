'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  birth_date: string | null
}

export interface AppSettings {
  id: string
  user_id: string
  energy_provider: string | null
  api_key: string | null
  api_endpoint: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Fetch profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') throw profileError
          setProfile(profileData)

          // Fetch app settings
          const { data: settingsData, error: settingsError } = await supabase
            .from('app_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (settingsError && settingsError.code !== 'PGRST116') throw settingsError
          setAppSettings(settingsData)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return { user, profile, appSettings, loading, error }
}
