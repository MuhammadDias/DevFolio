'use client'
// app/auth/login/page.tsx
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get('redirectTo') ?? '/dashboard'
  const supabase = createClient()

  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: form.email, password: form.password,
      })
      if (err) throw err
      router.push(redirectTo)
      router.refresh()
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials'
        ? 'Invalid email or password.'
        : err.message ?? 'Login failed.')
    } finally { setLoading(false) }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=${redirectTo}` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl font-black text-white tracking-tight">dev<span className="text-[#1DB954]">folio</span></span>
          <p className="text-[#B3B3B3] text-sm mt-2">Welcome back</p>
        </div>

        <div className="card-dark">
          <h1 className="text-xl font-bold text-white mb-6">Sign in</h1>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button
            onClick={handleGoogle} disabled={googleLoading}
            className="btn-secondary w-full mb-4"
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-xs text-[#B3B3B3]">or</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-1.5">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                className="input-dark" placeholder="you@example.com"
                autoComplete="email" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-1.5">Password</label>
              <input
                name="password" type="password" value={form.password} onChange={handleChange}
                className="input-dark" placeholder="Your password"
                autoComplete="current-password" required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-[#B3B3B3]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-[#1DB954] font-semibold hover:underline">Sign up free</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
