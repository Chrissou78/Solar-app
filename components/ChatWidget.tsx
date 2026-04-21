'use client'

import { useEffect, useState } from 'react'
import { useSystem } from '@/lib/hooks/useSystem'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { system } = useSystem()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! 👋 I\'m your Solar Energy Assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !system) return

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

  if (!mounted) return null

  return (
    <>
      {/* Chat Widget Button - Fixed at bottom right */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 p-4 rounded-full shadow-lg hover:shadow-xl transition animate-bounce"
          style={{ backgroundColor: '#3b82f6' }}
          title="Chat with AI Assistant"
        >
          <MessageCircle size={28} color="#fff" />
        </button>
      )}

      {/* Chat Widget Window */}
      {open && (
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            maxHeight: '90vh',
          }}
          className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 w-96 max-w-[calc(100vw-32px)] rounded-lg border shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
            }}
            className="flex items-center justify-between p-4 rounded-t-lg"
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-semibold">Solar Assistant</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:opacity-80 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: 'calc(90vh - 180px)' }}
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
                  className="max-w-xs rounded-lg p-3"
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    style={{
                      color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
                    }}
                    className="text-xs mt-1"
                  >
                    {msg.timestamp.toLocaleTimeString([], {
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
                  className="rounded-lg p-3"
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
          <div
            className="flex gap-2 p-4 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask something..."
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              style={{
                backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                color: '#fff',
              }}
              className="rounded-lg px-3 py-2 hover:opacity-80 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Overlay when chat is open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />
      )}
    </>
  )
}
