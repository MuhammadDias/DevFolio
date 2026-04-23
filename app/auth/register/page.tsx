'use client'
// app/auth/register/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm]   = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirm) {
      setError('Passwords do not match.'); return
    }
    if (form.username.length < 3) {
      setError('Username must be at least 3 characters.'); return
    }
    if (!/^[a-z0-9_-]+$/.test(form.username)) {
      setError('Username can only contain lowercase letters, numbers, _ and -.'); return
    }

    setLoading(true)
    try {
      // Check username availability
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', form.username)
        .maybeSingle()

      if (existing) { setError('Username is already taken.'); return }

      const { error: signUpError } = await supabase.auth.signUp({
        email:    form.email,
        password: form.password,
        options:  { data: { username: form.username } },
      })

      if (signUpError) throw signUpError

      router.push('/dashboard?welcome=1')
    } catch (err: any) {
      setError(err.message ?? 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-black text-white tracking-tight">dev<span className="text-[#1DB954]">folio</span></span>
          <p className="text-[#B3B3B3] text-sm mt-2">Create your portfolio in minutes</p>
        </div>

        <div className="card-dark">
          <h1 className="text-xl font-bold text-white mb-6">Create an account</h1>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B3B3B3] text-sm select-none">@</span>
                <input
                  name="username" value={form.username} onChange={handleChange}
                  className="input-dark pl-8" placeholder="yourname"
                  autoComplete="username" required
                />
              </div>
              <p className="text-xs text-[#B3B3B3] mt-1">Your public URL: devfolio.app/<strong className="text-white">{form.username || 'yourname'}</strong></p>
            </div>

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
                className="input-dark" placeholder="Min. 8 characters"
                autoComplete="new-password" minLength={8} required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-1.5">Confirm Password</label>
              <input
                name="confirm" type="password" value={form.confirm} onChange={handleChange}
                className="input-dark" placeholder="Repeat password"
                autoComplete="new-password" required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-[#B3B3B3]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#1DB954] font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
