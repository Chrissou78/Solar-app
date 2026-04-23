'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSystem } from '@/lib/hooks/useSystem'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { loadTranslations } from '@/lib/i18n'
import ProductionChart from '@/components/Dashboard/ProductionChart'
import MonthlyComparisonChart from '@/components/Dashboard/MonthlyComparisonChart'
import PerformanceCalendar from '@/components/Dashboard/PerformanceCalendar'
import EfficiencyMetrics from '@/components/Dashboard/EfficiencyMetrics'
import { AlertCircle, Calendar, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { language, mounted: langMounted } = useLanguage()
  const [t, setT] = useState<any>({})
  const [mounted, setMounted] = useState(false)
  const { system, loading, error } = useSystem()
  const [todayProduction, setTodayProduction] = useState(0)
  const [monthlyProduction, setMonthlyProduction] = useState(0)

  // Load translations when language changes
  useEffect(() => {
    if (langMounted) {
      loadTranslations(language).then(data => {
        setT(data || {})
      }).catch(err => {
        console.error('Failed to load translations:', err)
        setT({})
      })
    }
  }, [language, langMounted])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!system || !system.daily_production) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayData = system.daily_production.find(p => {
      const prodDate = new Date(p.production_date)
      prodDate.setHours(0, 0, 0, 0)
      return prodDate.getTime() === today.getTime()
    })

    setTodayProduction(todayData?.kwh_produced || 0)

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const monthTotal = system.daily_production
      .filter(p => new Date(p.production_date) >= monthStart)
      .reduce((sum, p) => sum + p.kwh_produced, 0)

    setMonthlyProduction(monthTotal)
  }, [system])

  if (!mounted || !langMounted || loading) {
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

  const savingsPerKwh = 0.12
  const monthlySavings = monthlyProduction * savingsPerKwh

  // Calculate monthly data for chart
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
      savings: Math.round(monthProduction * savingsPerKwh),
    })
  }

  // Performance calendar data - with proper YYYY-MM-DD format
  const calendarData = system.daily_production.map((p) => ({
    date: new Date(p.production_date).toISOString().split('T')[0],
    production: p.kwh_produced,
    expected: p.expected_kwh,
  }))

  // Efficiency metrics
  const totalProduction = system.daily_production.reduce((sum, p) => sum + p.kwh_produced, 0)
  const expectedProduction = system.daily_production.reduce((sum, p) => sum + p.expected_kwh, 0)
  const daysTracked = system.daily_production.length

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>
            {t.dashboard?.welcomeBack || 'Welcome back'}, {system.system_name}!
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {system.location} • {system.system_size_kw}kW {system.inverter_type}
          </p>
        </div>

        {/* KPI Cards - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Production */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6 hover:opacity-80 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-semibold">
                {t.dashboard?.todayProduction || "Today's Production"}
              </h3>
              <TrendingUp size={18} style={{ color: '#3b82f6' }} />
            </div>
            <div className="mb-4">
              <span style={{ color: '#3b82f6' }} className="text-5xl font-bold">{todayProduction.toFixed(1)}</span>
              <span style={{ color: 'var(--text-secondary)' }} className="ml-2">kWh</span>
            </div>
            <div style={{ color: '#10b981' }} className="text-sm font-medium">
              {t.dashboard?.realtimeData || 'Real-time data'}
            </div>
          </div>

          {/* This Month */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6 hover:opacity-80 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-semibold">
                {t.dashboard?.thisMonth || 'This Month'}
              </h3>
              <TrendingUp size={18} style={{ color: '#06b6d4' }} />
            </div>
            <div className="mb-4">
              <span style={{ color: '#06b6d4' }} className="text-5xl font-bold">{monthlyProduction.toFixed(1)}</span>
              <span style={{ color: 'var(--text-secondary)' }} className="ml-2">kWh</span>
            </div>
            <div style={{ color: '#10b981' }} className="text-sm font-medium">
              {t.dashboard?.fromDatabase || 'From database'}
            </div>
          </div>

          {/* Savings */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6 hover:opacity-80 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-semibold">
                {t.dashboard?.monthlySavings || 'Monthly Savings'}
              </h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="mb-4">
              <span style={{ color: '#10b981' }} className="text-5xl font-bold">${monthlySavings.toFixed(0)}</span>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>@ ${savingsPerKwh}/kWh</div>
          </div>

          {/* System Status */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6 hover:opacity-80 transition">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-semibold">
                {t.dashboard?.systemStatus || 'System Status'}
              </h3>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="mb-4">
              <span style={{ color: '#10b981' }} className="text-3xl font-bold">
                {t.dashboard?.optimal || 'Optimal'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div style={{ backgroundColor: '#10b981' }} className="w-2 h-2 rounded-full"></div>
              {t.dashboard?.allHealthy || 'All systems healthy'}
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="mb-8">
          <EfficiencyMetrics
            system_size_kw={system.system_size_kw}
            totalProduction={totalProduction}
            expectedProduction={expectedProduction}
            daysTracked={daysTracked}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Production Trend Chart */}
          {system.daily_production && system.daily_production.length > 0 && (
            <ProductionChart 
              data={system.daily_production
                .slice(-30)
                .reverse()
                .map(p => ({
                  date: new Date(p.production_date).toLocaleDateString(language === 'en' ? 'en-US' : language, { 
                    month: 'short', 
                    day: 'numeric' 
                  }),
                  actual: parseFloat(p.kwh_produced.toFixed(1)),
                  expected: parseFloat(p.expected_kwh.toFixed(1)),
                }))}
            />
          )}

          {/* Monthly Comparison Chart */}
          <MonthlyComparisonChart data={monthlyData} />
        </div>

        {/* Performance Calendar */}
        <div className="mb-8">
          <PerformanceCalendar data={calendarData} />
        </div>

        {/* Alerts & Maintenance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts */}
          <Link href="/alerts" className="lg:col-span-2 block">
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }} className="rounded-xl border p-6 h-full hover:opacity-80 transition cursor-pointer">
              <div className="flex items-center gap-3 mb-6">
                <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.2)' }} className="p-2 rounded-lg">
                  <AlertCircle size={20} style={{ color: '#fbbf24' }} />
                </div>
                <h3 className="text-lg font-semibold">
                  {t.dashboard?.activeAlerts || 'Active Alerts'} ({system.alerts.filter(a => !a.dismissed).length})
                </h3>
              </div>
              <div className="space-y-3">
                {system.alerts.filter(a => !a.dismissed).slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                    }}
                    className="p-4 rounded-lg border"
                  >
                    <h4 className="font-semibold mb-1">{alert.title}</h4>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{alert.description}</p>
                  </div>
                ))}
                {system.alerts.filter(a => !a.dismissed).length > 3 && (
                  <p style={{ color: '#3b82f6' }} className="text-sm font-medium">
                    +{system.alerts.filter(a => !a.dismissed).length - 3} {t.dashboard?.moreAlerts || 'more alerts'}
                  </p>
                )}
              </div>
            </div>
          </Link>

          {/* Maintenance & Support */}
          <div className="space-y-6">
            {/* Maintenance */}
            <Link href="/maintenance" className="block">
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }} className="rounded-xl border p-6 h-full hover:opacity-80 transition cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }} className="p-2 rounded-lg">
                    <Calendar size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {t.dashboard?.nextMaintenance || 'Next Maintenance'}
                  </h3>
                </div>
                {system.maintenance_tasks.length > 0 && system.maintenance_tasks.filter(t => !t.completed).slice(0, 1).map((task) => {
                  const daysUntilDue = Math.ceil(
                    (new Date(task.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <div key={task.id}>
                      <p className="font-medium mb-1">{task.title}</p>
                      <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                        {t.dashboard?.dueIn || 'Due in'} {daysUntilDue} {t.dashboard?.days || 'days'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
