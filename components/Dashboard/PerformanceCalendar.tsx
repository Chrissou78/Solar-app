'use client'
import { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'

interface PerformanceCalendarProps {
  data: Array<{
    date: string
    production: number
    expected: number
  }>
}

export default function PerformanceCalendar({ data }: PerformanceCalendarProps) {
  const calendarData = useMemo(() => {
    const today = new Date()
    const days = []
    
    // Get last 42 days (6 weeks)
    for (let i = 41; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayData = data.find(d => d.date === dateStr)
      
      days.push({
        date: dateStr,
        production: dayData?.production || 0,
        expected: dayData?.expected || 0,
        dayOfMonth: date.getDate(),
      })
    }
    
    return days
  }, [data])

  const getColor = (production: number, expected: number) => {
    if (production === 0) return 'bg-gray-200 dark:bg-gray-700'
    const ratio = production / expected
    if (ratio >= 1) return 'bg-green-500 dark:bg-green-600'
    if (ratio >= 0.8) return 'bg-blue-500 dark:bg-blue-600'
    if (ratio >= 0.6) return 'bg-yellow-500 dark:bg-yellow-600'
    return 'bg-red-500 dark:bg-red-600'
  }

  const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeks = []
  
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7))
  }

  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-gray-900" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          Production Heatmap (42 days)
        </h3>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500 dark:bg-green-600"></div>
          <span style={{ color: 'var(--text-secondary)' }}>≥100%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500 dark:bg-blue-600"></div>
          <span style={{ color: 'var(--text-secondary)' }}>80–99%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500 dark:bg-yellow-600"></div>
          <span style={{ color: 'var(--text-secondary)' }}>60–79%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500 dark:bg-red-600"></div>
          <span style={{ color: 'var(--text-secondary)' }}>{"<60%"}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Day labels */}
          <div className="flex gap-1 mb-2">
            {weekLabels.map(day => (
              <div
                key={day}
                className="w-7 h-7 flex items-center justify-center text-xs font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex gap-1 mb-1">
              {week.map(day => (
                <div
                  key={day.date}
                  className={`w-7 h-7 rounded cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 flex items-center justify-center text-xs font-bold ${getColor(
                    day.production,
                    day.expected
                  )}`}
                  title={`${day.date}: ${day.production.toFixed(1)} kWh (Expected: ${day.expected.toFixed(1)} kWh)`}
                  style={{ color: day.production > 0 ? 'white' : 'transparent' }}
                >
                  {day.dayOfMonth}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p style={{ color: 'var(--text-secondary)' }}>Avg. Production (42d)</p>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {(calendarData.reduce((sum, d) => sum + d.production, 0) / calendarData.length).toFixed(1)} kWh
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)' }}>Total Production (42d)</p>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {calendarData.reduce((sum, d) => sum + d.production, 0).toFixed(0)} kWh
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
