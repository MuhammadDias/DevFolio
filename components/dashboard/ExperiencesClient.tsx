'use client'
// components/dashboard/ExperiencesClient.tsx
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Experience } from '@/lib/types'

interface Props { initialExperiences: Experience[]; userId: string }

const EMPTY = {
  company: '', position: '', start_date: '', end_date: '',
  is_current: false, description: '', location: '',
}

function formatDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function ExperiencesClient({ initialExperiences, userId }: Props) {
  const supabase = createClient()
  const [experiences, setExperiences] = useState(initialExperiences)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Experience | null>(null)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true) }
  function openEdit(ex: Experience) {
    setEditing(ex)
    setForm({
      company: ex.company, position: ex.position,
      start_date: ex.start_date ?? '', end_date: ex.end_date ?? '',
      is_current: ex.is_current, description: ex.description ?? '', location: ex.location ?? '',
    })
    setShowForm(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const payload = {
        ...form,
        user_id: userId,
        end_date: form.is_current ? null : form.end_date || null,
        start_date: form.start_date || null,
      }
      if (editing) {
        const { data } = await supabase.from('experiences').update(payload).eq('id', editing.id).select().single()
        setExperiences(prev => prev.map(ex => ex.id === editing.id ? data : ex))
      } else {
        const { data } = await supabase.from('experiences').insert(payload).select().single()
        setExperiences(prev => [data, ...prev])
      }
      setShowForm(false)
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this experience?')) return
    await supabase.from('experiences').delete().eq('id', id)
    setExperiences(prev => prev.filter(ex => ex.id !== id))
  }

  return (
    <div>
      <div className="mb-6">
        <button onClick={openAdd} className="btn-primary">+ Add Experience</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl border border-black/10 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-black mb-4">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-black/60 mb-1">Company *</label>
                  <input name="company" value={form.company} onChange={handleChange} className="input-dark" required />
                </div>
                <div>
                  <label className="block text-xs text-black/60 mb-1">Position *</label>
                  <input name="position" value={form.position} onChange={handleChange} className="input-dark" required />
                </div>
              </div>
              <div>
                <label className="block text-xs text-black/60 mb-1">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="input-dark" placeholder="City, Country / Remote" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-black/60 mb-1">Start Date</label>
                  <input name="start_date" type="date" value={form.start_date} onChange={handleChange} className="input-dark" />
                </div>
                <div>
                  <label className="block text-xs text-black/60 mb-1">End Date</label>
                  <input name="end_date" type="date" value={form.end_date} onChange={handleChange}
                    className="input-dark" disabled={form.is_current} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-black/60 cursor-pointer">
                <input type="checkbox" name="is_current" checked={form.is_current} onChange={handleChange} className="accent-violet-600" />
                Currently working here
              </label>
              <div>
                <label className="block text-xs text-black/60 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  className="input-dark resize-none" rows={4}
                  placeholder="Describe your responsibilities and achievements…" />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {experiences.length === 0 ? (
        <div className="card-dark text-center py-12 text-black/60">
          <div className="text-4xl mb-3">💼</div>
          <p className="font-medium text-black">No experience added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map(ex => (
            <div key={ex.id} className="card-dark">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-black">{ex.position}</h3>
                  <p className="text-violet-700 text-sm font-medium">{ex.company}</p>
                  {ex.location && <p className="text-xs text-black/55 mt-0.5">{ex.location}</p>}
                  <p className="text-xs text-black/55 mt-1">
                    {formatDate(ex.start_date)} – {ex.is_current ? 'Present' : formatDate(ex.end_date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(ex)} className="text-xs text-black/60 hover:text-black px-2 py-1 rounded border border-black/15 hover:border-black/35 transition-all">Edit</button>
                  <button onClick={() => handleDelete(ex.id)} className="text-xs text-red-400 px-2 py-1 rounded border border-red-500/20 hover:border-red-500/40 transition-all">Delete</button>
                </div>
              </div>
              {ex.description && <p className="text-sm text-black/55 mt-2 leading-relaxed">{ex.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
