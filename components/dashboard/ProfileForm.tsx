'use client'
// components/dashboard/ProfileForm.tsx
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

interface Props { profile: Profile | null }

export default function ProfileForm({ profile }: Props) {
  const supabase = createClient()
  const [form, setForm] = useState({
    full_name:  profile?.full_name  ?? '',
    bio:        profile?.bio        ?? '',
    website:    profile?.website    ?? '',
    github:     profile?.github     ?? '',
    linkedin:   profile?.linkedin   ?? '',
    twitter:    profile?.twitter    ?? '',
    avatar_url: profile?.avatar_url ?? '',
  })
  const [status, setStatus]   = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('profiles')
        .update(form)
        .eq('id', user!.id)
      if (error) throw error
      setStatus('saved'); setMessage('Profile saved!')
      setTimeout(() => setStatus('idle'), 2500)
    } catch (err: any) {
      setStatus('error'); setMessage(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#B3B3B3] mb-1.5">Full Name</label>
          <input name="full_name" value={form.full_name} onChange={handleChange}
            className="input-dark" placeholder="Your full name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#B3B3B3] mb-1.5">Avatar URL</label>
          <input name="avatar_url" value={form.avatar_url} onChange={handleChange}
            className="input-dark" placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#B3B3B3] mb-1.5">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange}
          className="input-dark resize-none" rows={3}
          placeholder="A short bio about yourself…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'website',  label: 'Website',  placeholder: 'https://yoursite.com' },
          { name: 'github',   label: 'GitHub',   placeholder: 'github.com/username' },
          { name: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/you' },
          { name: 'twitter',  label: 'Twitter',  placeholder: '@handle' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-xs font-medium text-[#B3B3B3] mb-1.5">{f.label}</label>
            <input name={f.name} value={(form as any)[f.name]} onChange={handleChange}
              className="input-dark" placeholder={f.placeholder} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={status === 'saving'} className="btn-primary">
          {status === 'saving' ? 'Saving…' : 'Save Changes'}
        </button>
        {message && (
          <span className={`text-sm ${status === 'saved' ? 'text-[#1DB954]' : 'text-red-400'}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  )
}
