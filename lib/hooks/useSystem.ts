'use client'

import { useEffect, useState } from 'react'

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
  taskType: string
  dueDate: string
  completed: boolean
}

interface DailyProduction {
  productionDate: string
  kwhProduced: number
  expectedKwh: number
}

interface System {
  id: number
  systemName: string
  systemSizeKw: number
  location: string
  inverterType: string
  installationDate: string
  alerts: Alert[]
  maintenanceTasks: MaintenanceTask[]
  dailyProduction: DailyProduction[]
}

interface UseSystemReturn {
  system: System | null
  loading: boolean
  error: string | null
}

export function useSystem(): UseSystemReturn {
  const [system, setSystem] = useState<System | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const res = await fetch('/api/systems')
        if (!res.ok) throw new Error('Failed to fetch system')
        const data = await res.json()
        setSystem(data.systems?.[0] || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSystem()
  }, [])

  return { system, loading, error }
}
