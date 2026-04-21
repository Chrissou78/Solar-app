'use client'

import { useEffect, useState } from 'react'
import { useSystem } from '@/lib/hooks/useSystem'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { loadTranslations } from '@/lib/i18n'
import ProductionChart from '@/components/Dashboard/ProductionChart'
import MonthlyComparisonChart from '@/components/Dashboard/MonthlyComparisonChart'
import PerformanceCalendar from '@/components/Dashboard/PerformanceCalendar'
import EfficiencyMetrics from '@/components/Dashboard/EfficiencyMetrics'
import { Download } from 'lucide-react'

export default function Performance() {
  const { language, mounted: langMounted } = useLanguage()
  const [mounted] = useState(false)
  const { system, loading, error } = useSystem()
  const [setT] = useState<any>({})

  useEffect(() => {
    if (langMounted) {
        loadTranslations(language).then(data => setT(data))
    }
  }, [language, langMounted])

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

  const totalProduction = system.dailyProduction.reduce((sum, p) => sum + p.kwhProduced, 0)
  const expectedProduction = system.dailyProduction.reduce((sum, p) => sum + p.expectedKwh, 0)
  const daysTracked = system.dailyProduction.length

  // Monthly data
  const monthlyData = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const monthProduction = system.dailyProduction
      .filter(p => {
        const pDate = new Date(p.productionDate)
        return pDate >= monthStart && pDate <= monthEnd
      })
      .reduce((sum, p) => sum + p.kwhProduced, 0)

    monthlyData.push({
      month: date.toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'short' }),
      production: Math.round(monthProduction),
      savings: Math.round(monthProduction * 0.12),
    })
  }

  // Calendar data
  const calendarData = system.dailyProduction
    .map((p) => ({
      date: new Date(p.productionDate).toLocaleDateString(language === 'en' ? 'en-US' : language, { month: 'short', day: 'numeric' }),
      production: p.kwhProduced,
      expected: p.expectedKwh,
      dayOfMonth: new Date(p.productionDate).getDate(),
    }))

  const downloadReport = () => {
    const report = {
      system: system.systemName,
      location: system.location,
      size: system.systemSizeKw,
      totalProduction,
      expectedProduction,
      efficiency: ((totalProduction / expectedProduction) * 100).toFixed(1),
      daysTracked,
      generatedAt: new Date().toISOString(),
    }

    const csv = `Solar System Performance Report\n\n`
      + `System: ${report.system}\n`
      + `Location: ${report.location}\n`
      + `Size: ${report.size}kW\n`
      + `Generated: ${new Date().toLocaleDateString()}\n\n`
      + `Total Production (kWh): ${report.totalProduction.toFixed(2)}\n`
      + `Expected Production (kWh): ${report.expectedProduction.toFixed(2)}\n`
      + `Efficiency: ${report.efficiency}%\n`
      + `Days Tracked: ${report.daysTracked}\n\n`
      + `Daily Data\n`
      + `Date,Production (kWh),Expected (kWh)\n`
      + system.dailyProduction.map(p => 
        `${new Date(p.productionDate).toLocaleDateString()},${p.kwhProduced},${p.expectedKwh}`
      ).join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    element.setAttribute('download', `solar-report-${new Date().toISOString().split('T')[0]}.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>
              Performance Analytics
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Detailed analysis of your solar system's performance
            </p>
          </div>
          <button
            onClick={downloadReport}
            style={{ backgroundColor: '#3b82f6', color: '#fff' }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition font-medium"
          >
            <Download size={20} />
            Export Report
          </button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">Total Production</p>
            <p style={{ color: '#3b82f6' }} className="text-4xl font-bold">{totalProduction.toFixed(0)}</p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">kWh</p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">System Efficiency</p>
            <p style={{ color: '#10b981' }} className="text-4xl font-bold">
              {((totalProduction / expectedProduction) * 100).toFixed(1)}%
            </p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">vs expected</p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-xl border p-6">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">Period Tracked</p>
            <p style={{ color: '#06b6d4' }} className="text-4xl font-bold">{daysTracked}</p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">days</p>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="mb-12">
          <EfficiencyMetrics
            systemSizeKw={system.systemSizeKw}
            totalProduction={totalProduction}
            expectedProduction={expectedProduction}
            daysTracked={daysTracked}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 mb-12">
            {system.dailyProduction && system.dailyProduction.length > 0 && (
                <ProductionChart 
                data={system.dailyProduction
                    .reverse()
                    .map(p => ({
                    date: new Date(p.productionDate).toLocaleDateString(language === 'en' ? 'en-US' : language, { 
                        month: 'short', 
                        day: 'numeric' 
                    }),
                    actual: parseFloat(p.kwhProduced.toFixed(1)),
                    expected: parseFloat(p.expectedKwh.toFixed(1)),
                    }))}
                />
            )}

            <MonthlyComparisonChart data={monthlyData} />
        </div>

        {/* Calendar */}
        <div className="mb-12">
          <PerformanceCalendar data={calendarData} />
        </div>
      </div>
    </div>
  )
}
