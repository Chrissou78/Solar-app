'use client'

import { useEffect, useState } from 'react'
import { useSystem } from '@/lib/hooks/useSystem'
import { useLanguage } from '@/lib/hooks/useLanguage'
import { loadTranslations } from '@/lib/i18n'
import { Send, MessageCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Support() {
  const { language, mounted: langMounted } = useLanguage()
  const [mounted] = useState(false)
  const { system, loading, error } = useSystem()
  const [setT] = useState<any>({})
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your solar energy assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (langMounted) {
        loadTranslations(language).then(data => setT(data))
    }
  }, [language, langMounted])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          systemInfo: system,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: '#3b82f6' }}>
            <MessageCircle size={32} />
            AI Support Assistant
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Ask me anything about your solar system
          </p>
        </div>

        {/* Chat Messages */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
          className="flex-1 rounded-lg border p-6 mb-6 overflow-y-auto space-y-4"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                style={{
                  backgroundColor: msg.role === 'user' ? '#3b82f6' : 'var(--bg-tertiary)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                }}
                className="max-w-xs lg:max-w-md rounded-lg p-4"
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  style={{
                    color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
                  }}
                  className="text-xs mt-2"
                >
                  {msg.timestamp.toLocaleTimeString(language === 'en' ? 'en-US' : language, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
                className="rounded-lg p-4"
              >
                <div className="flex gap-1">
                  <div
                    style={{ backgroundColor: 'var(--text-secondary)' }}
                    className="w-2 h-2 rounded-full animate-bounce"
                  ></div>
                  <div
                    style={{ backgroundColor: 'var(--text-secondary)' }}
                    className="w-2 h-2 rounded-full animate-bounce"
                  ></div>
                  <div
                    style={{ backgroundColor: 'var(--text-secondary)' }}
                    className="w-2 h-2 rounded-full animate-bounce"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a question..."
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            className="flex-1 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            style={{
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: '#fff',
            }}
            className="rounded-lg px-4 py-3 hover:opacity-80 transition font-medium disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
