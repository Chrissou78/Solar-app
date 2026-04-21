'use client'

interface CalendarDay {
  date: string
  production: number
  expected: number
  dayOfMonth: number
}

interface PerformanceCalendarProps {
  data: CalendarDay[]
}

export default function PerformanceCalendar({ data }: PerformanceCalendarProps) {
  if (data.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }} className="rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Calendar</h3>
        <p style={{ color: 'var(--text-secondary)' }}>No data available</p>
      </div>
    )
  }

  // Group by weeks
  const weeks: CalendarDay[][] = []
  let currentWeek: CalendarDay[] = []
  
  data.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) weeks.push(currentWeek)

  const getIntensity = (production: number, expected: number) => {
    const ratio = expected > 0 ? production / expected : 0
    if (ratio >= 0.9) return '#10b981' // Green - excellent
    if (ratio >= 0.75) return '#3b82f6' // Blue - good
    if (ratio >= 0.6) return '#f59e0b' // Amber - fair
    return '#ef4444' // Red - low
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--border-color)',
    }} className="rounded-xl border p-6">
      <h3 className="text-lg font-semibold mb-6">Performance Calendar</h3>
      
      <div className="space-y-4">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex gap-2">
            {week.map((day) => {
              const intensity = getIntensity(day.production, day.expected)
              return (
                <div
                  key={day.date}
                  style={{
                    backgroundColor: intensity,
                    opacity: 0.7,
                  }}
                  className="flex-1 aspect-square rounded-lg flex items-center justify-center cursor-pointer hover:opacity-100 transition group relative"
                  title={`${day.date}: ${day.production.toFixed(1)} kWh`}
                >
                  <span className="text-xs font-semibold text-white">
                    {day.dayOfMonth}
                  </span>
                  
                  {/* Tooltip */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                    }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 p-2 rounded hidden group-hover:block whitespace-nowrap text-xs border"
                  >
                    <p className="font-semibold">{day.date}</p>
                    <p>{day.production.toFixed(1)} kWh</p>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
                      Expected: {day.expected.toFixed(1)} kWh
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: '#10b981', opacity: 0.7 }} className="w-3 h-3 rounded"></div>
          <span>Excellent (90%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: '#3b82f6', opacity: 0.7 }} className="w-3 h-3 rounded"></div>
          <span>Good (75-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: '#f59e0b', opacity: 0.7 }} className="w-3 h-3 rounded"></div>
          <span>Fair (60-75%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ backgroundColor: '#ef4444', opacity: 0.7 }} className="w-3 h-3 rounded"></div>
          <span>Low (&lt;60%)</span>
        </div>
      </div>
    </div>
  )
}
