'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Alert {
  id: number
  title: string
  description: string
  severity: string
  dismissed: boolean
}

interface MaintenanceTask {
  id: number
  title: string
  description: string
  task_type: string
  due_date: string
  completed: boolean
}

interface DailyProduction {
  production_date: string
  kwh_produced: number
  expected_kwh: number
}

interface System {
  id: number
  system_name: string
  system_size_kw: number
  location: string
  inverter_type: string
  installation_date: string
  alerts: Alert[]
  maintenance_tasks: MaintenanceTask[]
  daily_production: DailyProduction[]
}

export function useSystem() {
  const [system, setSystem] = useState<System | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const supabase = createClient()
        
        const { data, error: fetchError } = await supabase
          .from('systems')
          .select(`
            *,
            alerts (*),
            maintenance_tasks (*),
            daily_production (*)
          `)
          .limit(1)
          .single()

        if (fetchError) {
          console.error('Supabase error:', fetchError)
          throw fetchError
        }

        setSystem(data as System)
      } catch (err) {
        console.error('Error fetching system:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        
        // Fallback to mock data
        setSystem({
          id: 1,
          system_name: 'Demo System',
          system_size_kw: 8,
          location: 'Austin, TX',
          inverter_type: 'Fronius',
          installation_date: '2023-06-15',
          alerts: [],
          maintenance_tasks: [],
          daily_production: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSystem()
  }, [])

  return { system, loading, error }
}
