'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md p-8 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Virtual Energy</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-8">Sign in to your account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Email
            </label>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <Mail size={18} style={{ color: 'var(--text-secondary)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent flex-1 outline-none" style={{ color: 'var(--text-primary)' }}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Password
            </label>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <Lock size={18} style={{ color: 'var(--text-secondary)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent flex-1 outline-none" style={{ color: 'var(--text-primary)' }}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: 'var(--accent)' }}
            className="w-full text-white font-semibold py-2 rounded-lg hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ color: 'var(--text-secondary)' }} className="text-center text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/auth/register" style={{ color: 'var(--accent)' }} className="font-semibold hover:opacity-80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
