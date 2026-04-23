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
    contact_email: profile?.contact_email ?? '',
    contact_phone: profile?.contact_phone ?? '',
    address: profile?.address ?? '',
    map_lat: profile?.map_lat != null ? String(profile.map_lat) : '',
    map_lng: profile?.map_lng != null ? String(profile.map_lng) : '',
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
      const parsedLat = form.map_lat.trim() === '' ? null : Number(form.map_lat)
      const parsedLng = form.map_lng.trim() === '' ? null : Number(form.map_lng)
      const payload = {
        ...form,
        map_lat: Number.isFinite(parsedLat as number) ? parsedLat : null,
        map_lng: Number.isFinite(parsedLng as number) ? parsedLng : null,
      }
      const { error } = await supabase
        .from('profiles')
        .update(payload)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1.5">Full Name</label>
          <input name="full_name" value={form.full_name} onChange={handleChange}
            className="input-dark" placeholder="Your full name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1.5">Avatar URL</label>
          <input name="avatar_url" value={form.avatar_url} onChange={handleChange}
            className="input-dark" placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-black/60 mb-1.5">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange}
          className="input-dark resize-none" rows={3}
          placeholder="A short bio about yourself…" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1.5">Contact Email</label>
          <input name="contact_email" value={form.contact_email} onChange={handleChange}
            className="input-dark" placeholder="hello@example.com" />
        </div>
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1.5">Contact Phone</label>
          <input name="contact_phone" value={form.contact_phone} onChange={handleChange}
            className="input-dark" placeholder="+62 812 0000 0000" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-black/60 mb-1.5">Address</label>
        <input name="address" value={form.address} onChange={handleChange}
          className="input-dark" placeholder="City, Province, Country" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1.5">Map Latitude</label>
          <input name="map_lat" value={form.map_lat} onChange={handleChange}
            className="input-dark" placeholder="-6.200000" />
        </div>
        <div>
          <label className="block text-xs font-medium text-black/60 mb-1.5">Map Longitude</label>
          <input name="map_lng" value={form.map_lng} onChange={handleChange}
            className="input-dark" placeholder="106.816666" />
        </div>
      </div>
      <p className="text-xs text-black/55 -mt-2">
        Tip: ambil koordinat dari Google Maps (klik lokasi, lalu copy nilai latitude/longitude).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'website',  label: 'Website',  placeholder: 'https://yoursite.com' },
          { name: 'github',   label: 'GitHub',   placeholder: 'github.com/username' },
          { name: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/you' },
          { name: 'twitter',  label: 'Twitter',  placeholder: '@handle' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-xs font-medium text-black/60 mb-1.5">{f.label}</label>
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
          <span className={`text-sm ${status === 'saved' ? 'text-violet-700' : 'text-red-500'}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  )
}
