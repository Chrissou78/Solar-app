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

interface daily_production{
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
  daily_production: daily_production[]
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

        if (fetchError) throw fetchError

        setSystem(data as System)
      } catch (err) {
        console.error('Error fetching system:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSystem()
  }, [])

  return { system, loading, error }
}
