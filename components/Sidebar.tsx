'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, AlertCircle, Wrench, TrendingUp, Settings, MessageCircle, Mail } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/alerts', label: 'Alerts', icon: AlertCircle },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/performance', label: 'Performance', icon: TrendingUp },
  { href: '/support', label: 'Support', icon: MessageCircle },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }} className="w-64 min-h-screen p-6">
      <nav className="space-y-2">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname === `/(protected)${item.href}`
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? 'opacity-100' : 'opacity-60 hover:opacity-80'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-primary)',
              }}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
