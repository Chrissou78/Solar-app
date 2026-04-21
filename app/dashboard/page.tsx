'use client'

import { useEffect, useState } from 'react'
import { useSystem } from '@/lib/hooks/useSystem'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { loadTranslations } from '@/lib/i18n'
import ProductionChart from '@/components/Dashboard/ProductionChart'
import MonthlyComparisonChart from '@/components/Dashboard/MonthlyComparisonChart'
import PerformanceCalendar from '@/components/Dashboard/PerformanceCalendar'
import EfficiencyMetrics from '@/components/Dashboard/EfficiencyMetrics'
import Link from 'next/link'
import { AlertCircle, Wrench, MessageCircle } from 'lucide-react'

export default function Dashboard() {
  const { language, mounted } = useLanguage()
  const { system, loading, error } = useSystem()
  const [t, setT] = useState<any>({})

  useEffect(() => {
    if (mounted) {
      loadTranslations(language).then(data => setT(data))
    }
  }, [language, mounted])

  if (!mounted || loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !system) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex items-center justify-center">
        <p>Error: {error || 'System not found'}</p>
      </div>
    )
  }

  // Calculate metrics
  const todayProduction = system.daily_production
    .filter(p => {
      const pDate = new Date(p.production_date)
      const today = new Date()
      return pDate.toDateString() === today.toDateString()
    })
    .reduce((sum, p) => sum + p.kwh_produced, 0)

  const monthlyProduction = system.daily_production
    .filter(p => {
      const pDate = new Date(p.production_date)
      const now = new Date()
      return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + p.kwh_produced, 0)

  const monthlySavings = monthlyProduction * 0.12

  const totalProduction = system.daily_production.reduce((sum, p) => sum + p.kwh_produced, 0)
  const expectedProduction = system.daily_production.reduce((sum, p) => sum + p.expected_kwh, 0)

  // Monthly data for chart
  const monthlyData = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const monthProduction = system.daily_production
      .filter(p => {
        const pDate = new Date(p.production_date)
        return pDate >= monthStart && pDate <= monthEnd
      })
      .reduce((sum, p) => sum + p.kwh_produced, 0)

    monthlyData.push({
      month: date.toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'short' }),
      production: Math.round(monthProduction),
      savings: Math.round(monthProduction * 0.12),
    })
  }

  // Calendar data for PerformanceCalendar
  const calendarData = system.daily_production.map((p) => ({
    date: new Date(p.production_date).toISOString().split('T')[0],
    production: p.kwh_produced,
    expected: p.expected_kwh,
  }))

  const activeAlerts = system.alerts.filter(a => !a.dismissed)
  const pendingMaintenance = system.maintenance_tasks.filter(t => !t.completed)

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
            {t.dashboard?.welcome || 'Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {system.system_name} • {system.location}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">Today's Production</p>
            <p style={{ color: 'var(--accent)' }} className="text-3xl font-bold">{todayProduction.toFixed(1)}</p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">kWh</p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">This Month</p>
            <p style={{ color: 'var(--accent)' }} className="text-3xl font-bold">{monthlyProduction.toFixed(0)}</p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">kWh</p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">Estimated Savings</p>
            <p style={{ color: 'var(--accent)' }} className="text-3xl font-bold">${monthlySavings.toFixed(2)}</p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">this month</p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">System Status</p>
            <p style={{ color: '#10b981' }} className="text-3xl font-bold">Optimal</p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">All systems operational</p>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="mb-12">
          <EfficiencyMetrics
            system_size_kw={system.system_size_kw}
            totalProduction={totalProduction}
            expectedProduction={expectedProduction}
            daysTracked={system.daily_production.length}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          {system.daily_production && system.daily_production.length > 0 && (
            <>
              <ProductionChart 
                data={system.daily_production
                  .slice(-90)
                  .map(p => ({
                    date: new Date(p.production_date).toLocaleDateString(language === 'en' ? 'en-US' : language, { 
                      month: 'short', 
                      day: 'numeric' 
                    }),
                    actual: parseFloat(p.kwh_produced.toFixed(1)),
                    expected: parseFloat(p.expected_kwh.toFixed(1)),
                  }))}
              />
              <MonthlyComparisonChart data={monthlyData} />
            </>
          )}
        </div>

        {/* Performance Calendar */}
        <div className="mb-12">
          <PerformanceCalendar data={calendarData} />
        </div>

        {/* Alerts and Maintenance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Alerts */}
          <Link href="/alerts" className="block">
            <div className="rounded-xl border p-6 h-full hover:opacity-80 cursor-pointer transition"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Active Alerts ({activeAlerts.length})
                </h3>
              </div>
              {activeAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="mb-3 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{alert.title}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{alert.description}</p>
                </div>
              ))}
              {activeAlerts.length > 3 && (
                <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  +{activeAlerts.length - 3} more alerts
                </p>
              )}
            </div>
          </Link>

          {/* Maintenance */}
          <Link href="/maintenance" className="block">
            <div className="rounded-xl border p-6 h-full hover:opacity-80 cursor-pointer transition"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}>
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5" style={{ color: '#f59e0b' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Maintenance Tasks ({pendingMaintenance.length})
                </h3>
              </div>
              {pendingMaintenance.slice(0, 1).map(task => {
                const daysUntilDue = Math.ceil(
                  (new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <div key={task.id} className="mb-3">
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Due in {daysUntilDue} days
                    </p>
                  </div>
                )
              })}
            </div>
          </Link>
        </div>

        {/* Support Widget */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="rounded-xl border p-6 text-center">
          <MessageCircle className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Need Help?</h3>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4">
            Chat with our AI assistant for tips, troubleshooting, and support.
          </p>
          <button style={{ backgroundColor: 'var(--accent)', color: 'white' }} className="px-4 py-2 rounded-lg hover:opacity-80 transition font-medium">
            Open Chat
          </button>
        </div>
      </div>
    </div>
  )
}