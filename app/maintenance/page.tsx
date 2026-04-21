'use client'

import { useEffect, useState } from 'react'
import { useSystem } from '@/lib/hooks/useSystem'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { loadTranslations } from '@/lib/i18n'
import { CheckCircle, Clock} from 'lucide-react'

export default function Maintenance() {
  const { language, mounted: langMounted } = useLanguage()
  const [mounted] = useState(false)
  const { system, loading, error } = useSystem()
  const [setT] = useState<any>({})
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [scheduledDate, setScheduledDate] = useState('')

  useEffect(() => {
    if (langMounted) {
        loadTranslations(language).then(data => setT(data))
    }
  }, [language, langMounted])

  const handleSchedule = (task: any) => {
    setSelectedTask(task)
    setShowModal(true)
    setScheduledDate(new Date().toISOString().split('T')[0])
  }

  const confirmSchedule = () => {
    if (scheduledDate) {
      alert(`✅ Maintenance scheduled for ${new Date(scheduledDate).toLocaleDateString()}\n\nTask: ${selectedTask.title}`)
      setShowModal(false)
      setSelectedTask(null)
    }
  }

  const markComplete = (taskId: number) => {
    setCompletedTasks([...completedTasks, taskId])
  }

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

  const upcomingTasks = system.maintenanceTasks
    .filter(t => !completedTasks.includes(t.id))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const completedTasksList = system.maintenanceTasks.filter(t => completedTasks.includes(t.id))

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>
            Maintenance Schedule
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Keep your solar system running at peak efficiency
          </p>
        </div>

        {/* Upcoming Tasks */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={24} style={{ color: '#f59e0b' }} />
            <h2 className="text-2xl font-bold">Upcoming Tasks</h2>
          </div>

          {upcomingTasks.length > 0 ? (
            <div className="space-y-4">
              {upcomingTasks.map((task) => {
                const daysUntilDue = Math.ceil(
                  (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
                const isOverdue = daysUntilDue < 0

                return (
                  <div
                    key={task.id}
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: isOverdue ? '#ef4444' : 'var(--border-color)',
                      borderLeftWidth: '4px',
                      borderLeftColor: isOverdue ? '#ef4444' : '#f59e0b',
                    }}
                    className="rounded-lg border p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                        <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{task.description}</p>
                      </div>
                      <div style={{
                        backgroundColor: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      }} className="px-3 py-1 rounded">
                        <p style={{ color: isOverdue ? '#ef4444' : '#f59e0b' }} className="text-sm font-medium">
                          {isOverdue ? `Overdue ${Math.abs(daysUntilDue)} days` : `Due in ${daysUntilDue} days`}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleSchedule(task)}
                        style={{ backgroundColor: '#3b82f6', color: '#fff' }} 
                        className="px-4 py-2 rounded-lg hover:opacity-80 transition font-medium"
                      >
                        Schedule Now
                      </button>
                      <button 
                        onClick={() => markComplete(task.id)}
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-color)',
                        }} 
                        className="px-4 py-2 rounded-lg hover:opacity-80 transition font-medium border"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }} className="rounded-lg border p-6 text-center">
              <CheckCircle size={32} style={{ color: '#10b981' }} className="mx-auto mb-4" />
              <p style={{ color: 'var(--text-secondary)' }}>No upcoming maintenance tasks</p>
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasksList.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle size={24} style={{ color: '#10b981' }} />
              <h2 className="text-2xl font-bold">Completed Tasks</h2>
            </div>

            <div className="space-y-3">
              {completedTasksList.map((task) => (
                <div
                  key={task.id}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                  className="rounded-lg border p-4 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                      Completed on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <CheckCircle size={20} style={{ color: '#10b981' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }} className="rounded-lg border p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Schedule Maintenance</h3>
            
            <div className="mb-6">
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">
                Task: <strong>{selectedTask?.title}</strong>
              </p>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4">
                {selectedTask?.description}
              </p>

              <label style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium block mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmSchedule}
                style={{ backgroundColor: '#3b82f6', color: '#fff' }}
                className="flex-1 px-4 py-2 rounded-lg hover:opacity-80 transition font-medium"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)',
                }}
                className="flex-1 px-4 py-2 rounded-lg hover:opacity-80 transition font-medium border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
