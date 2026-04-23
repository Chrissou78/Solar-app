'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Mail, Lock, User } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Sign up user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError
      if (!user) throw new Error('User creation failed')

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        email,
        first_name: firstName,
        last_name: lastName,
      })

      if (profileError) throw profileError

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
        <p style={{ color: 'var(--text-secondary)' }} className="mb-8">Create your account</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                First Name
              </label>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <User size={18} style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="bg-transparent flex-1 outline-none" style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Last Name
              </label>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <User size={18} style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="bg-transparent flex-1 outline-none" style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>

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
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-2">
              Min 6 characters
            </p>
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ color: 'var(--text-secondary)' }} className="text-center text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--accent)' }} className="font-semibold hover:opacity-80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
