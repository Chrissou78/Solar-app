'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, BarChart3, Zap, AlertCircle, MessageSquare, Settings, Home } from 'lucide-react'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/performance', label: 'Performance', icon: BarChart3 },
    { href: '/maintenance', label: 'Maintenance', icon: Zap },
    { href: '/alerts', label: 'Alerts', icon: AlertCircle },
    { href: '/contact', label: 'Contact', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  if (!mounted) return null

  return (
    <>
      {/* Mobile Menu Button - only visible on screens < 1024px */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setOpen(!open)}
          className="p-4 rounded-full shadow-lg hover:shadow-xl transition"
          style={{ backgroundColor: '#3b82f6' }}
        >
          {open ? (
            <X size={24} color="#fff" />
          ) : (
            <Menu size={24} color="#fff" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar - visible on lg+ screens */}
      <nav className="hidden lg:flex lg:flex-col p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div
                style={{
                  backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  color: isActive ? '#3b82f6' : 'var(--text-primary)',
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:opacity-80 transition cursor-pointer"
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Mobile Sidebar - slides in from left on screens < 1024px */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <div className="pt-24 p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    onClick={() => setOpen(false)}
                    style={{
                      backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                      color: isActive ? '#3b82f6' : 'var(--text-primary)',
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:opacity-80 transition cursor-pointer"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}
    </>
  )
}
