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
    
    // Use all available data (up to 365 days)
    const maxDays = Math.min(data.length, 365)
    
    for (let i = maxDays - 1; i >= 0; i--) {
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

  const totalDays = calendarData.length
  const weeksCount = weeks.length

  return (
    <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Production Heatmap
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {totalDays} days • {weeksCount} weeks
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs">
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
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <span style={{ color: 'var(--text-secondary)' }}>No data</span>
        </div>
      </div>

      {/* Calendar Grid - Scrollable */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          {/* Day labels */}
          <div className="flex gap-1 mb-2">
            {weekLabels.map(day => (
              <div
                key={day}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks Grid */}
          <div className="flex flex-col gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex gap-1">
                {week.map(day => (
                  <div
                    key={day.date}
                    className={`flex-shrink-0 w-6 h-6 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 flex items-center justify-center text-xs font-bold ${getColor(
                      day.production,
                      day.expected
                    )}`}
                    title={`${day.date}: ${day.production.toFixed(1)} kWh (Expected: ${day.expected.toFixed(1)} kWh, ${((day.production / day.expected) * 100).toFixed(0)}%)`}
                    style={{ color: day.production > 0 ? 'white' : 'transparent', fontSize: '9px' }}
                  >
                    {day.production > 0 && day.dayOfMonth % 7 === 0 ? day.dayOfMonth : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <p style={{ color: 'var(--text-secondary)' }} className="font-medium">Avg Daily</p>
            <p className="font-semibold text-lg" style={{ color: 'var(--accent)' }}>
              {(calendarData.reduce((sum, d) => sum + d.production, 0) / calendarData.length).toFixed(1)}
            </p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs">kWh</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)' }} className="font-medium">Total</p>
            <p className="font-semibold text-lg" style={{ color: 'var(--accent)' }}>
              {calendarData.reduce((sum, d) => sum + d.production, 0).toFixed(0)}
            </p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs">kWh</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)' }} className="font-medium">Best Day</p>
            <p className="font-semibold text-lg" style={{ color: '#10b981' }}>
              {Math.max(...calendarData.map(d => d.production)).toFixed(1)}
            </p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs">kWh</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)' }} className="font-medium">Efficiency</p>
            <p className="font-semibold text-lg" style={{ color: '#3b82f6' }}>
              {((calendarData.reduce((sum, d) => sum + d.production, 0) / calendarData.reduce((sum, d) => sum + d.expected, 0)) * 100).toFixed(0)}%
            </p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs">avg</p>
          </div>
        </div>
      </div>
    </div>
  )
}
