'use client'
// app/auth/register/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.022 4.388 11.015 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.017 1.792-4.687 4.533-4.687 1.313 0 2.686.235 2.686.235v2.961H15.83c-1.492 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.088 24 18.095 24 12.073z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 3 18 18" />
      <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
      <path d="M9.88 5.09A11 11 0 0 1 12 5c6.5 0 10 7 10 7a18.6 18.6 0 0 1-3.12 4.19" />
      <path d="M6.61 6.61C3.91 8.42 2 12 2 12a18.7 18.7 0 0 0 6.24 6.15A10.6 10.6 0 0 0 12 19c1.01 0 1.97-.14 2.87-.4" />
    </svg>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm]   = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [facebookLoading, setFacebookLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  async function handleOAuth(provider: 'google' | 'facebook') {
    if (provider === 'google') setGoogleLoading(true)
    if (provider === 'facebook') setFacebookLoading(true)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard?welcome=1` },
    })
    if (oauthError) {
      setError(oauthError.message)
      setGoogleLoading(false)
      setFacebookLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dedede] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl font-black tracking-tight">dev<span className="text-violet-700">folio</span></span>
          <p className="text-black/60 text-sm mt-2">Create your portfolio in minutes</p>
        </div>

        <div className="card-dark">
          <h1 className="text-xl font-bold mb-6">Create an account</h1>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <button onClick={() => handleOAuth('google')} disabled={googleLoading} className="btn-secondary w-full">
              <GoogleIcon />
              {googleLoading ? 'Redirecting…' : 'Google'}
            </button>
            <button onClick={() => handleOAuth('facebook')} disabled={facebookLoading} className="btn-secondary w-full">
              <FacebookIcon />
              {facebookLoading ? 'Redirecting…' : 'Facebook'}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-black/15" />
            <span className="text-xs text-black/45">or</span>
            <div className="flex-1 h-px bg-black/15" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/65 mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50 text-sm select-none">@</span>
                <input
                  name="username" value={form.username} onChange={handleChange}
                  className="input-dark pl-8" placeholder="yourname"
                  autoComplete="username" required
                />
              </div>
              <p className="text-xs text-black/55 mt-1">Your public URL: devfolio.app/<strong className="text-black">{form.username || 'yourname'}</strong></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/65 mb-1.5">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                className="input-dark" placeholder="you@example.com"
                autoComplete="email" required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/65 mb-1.5">Password</label>
              <div className="relative">
                <input
                  key={showPassword ? 'show-password' : 'hide-password'}
                  name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  className="input-dark pr-12" placeholder="Min. 8 characters"
                  autoComplete="new-password" minLength={8} required
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-700 hover:text-violet-800"
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/65 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  key={showConfirmPassword ? 'show-confirm-password' : 'hide-confirm-password'}
                  name="confirm" type={showConfirmPassword ? 'text' : 'password'} value={form.confirm} onChange={handleChange}
                  className="input-dark pr-12" placeholder="Repeat password"
                  autoComplete="new-password" required
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-700 hover:text-violet-800"
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-black/60">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-violet-700 font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
