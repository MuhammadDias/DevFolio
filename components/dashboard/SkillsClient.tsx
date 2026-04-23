'use client'
// components/dashboard/SkillsClient.tsx
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Skill } from '@/lib/types'

interface Props { initialSkills: Skill[]; userId: string }

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Other']
const EMPTY = { name: '', category: 'Frontend', level: 3 }

const LEVEL_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']

export default function SkillsClient({ initialSkills, userId }: Props) {
  const supabase = createClient()
  const [skills, setSkills]   = useState(initialSkills)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Skill | null>(null)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true) }
  function openEdit(s: Skill) {
    setEditing(s)
    setForm({ name: s.name, category: s.category ?? 'Other', level: s.level ?? 3 })
    setShowForm(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.name === 'level' ? Number(e.target.value) : e.target.value }))

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, user_id: userId }
      if (editing) {
        const { data } = await supabase.from('skills').update(payload).eq('id', editing.id).select().single()
        setSkills(prev => prev.map(s => s.id === editing.id ? data : s))
      } else {
        const { data } = await supabase.from('skills').insert(payload).select().single()
        setSkills(prev => [...prev, data])
      }
      setShowForm(false)
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return
    await supabase.from('skills').delete().eq('id', id)
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category ?? 'Other'
    ;(acc[cat] = acc[cat] ?? []).push(s)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-6">
        <button onClick={openAdd} className="btn-primary">+ Add Skill</button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#181818] rounded-2xl border border-[#2a2a2a] p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-[#B3B3B3] mb-1">Skill Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-dark" required placeholder="e.g. React" />
              </div>
              <div>
                <label className="block text-xs text-[#B3B3B3] mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="input-dark bg-[#242424] cursor-pointer">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#B3B3B3] mb-2">Level: <span className="text-[#1DB954] font-semibold">{LEVEL_LABELS[form.level]}</span></label>
                <input name="level" type="range" min={1} max={5} value={form.level} onChange={handleChange}
                  className="w-full accent-[#1DB954]" />
                <div className="flex justify-between text-xs text-[#B3B3B3] mt-1">
                  <span>Beginner</span><span>Expert</span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {skills.length === 0 ? (
        <div className="card-dark text-center py-12 text-[#B3B3B3]">
          <div className="text-4xl mb-3">⚡</div>
          <p className="font-medium text-white">No skills added yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="card-dark">
              <h3 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-wider mb-3">{category}</h3>
              <div className="space-y-2">
                {items.map(s => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-sm text-white w-28 flex-shrink-0">{s.name}</span>
                    {/* Level bar */}
                    <div className="flex-1 flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
                          style={{ background: i <= (s.level ?? 0) ? '#1DB954' : '#2a2a2a' }} />
                      ))}
                    </div>
                    <span className="text-xs text-[#B3B3B3] w-20 text-right">{LEVEL_LABELS[s.level ?? 0]}</span>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(s)} className="text-xs text-[#B3B3B3] hover:text-white px-2 py-1 rounded border border-[#2a2a2a] hover:border-[#444] transition-all">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="text-xs text-red-400 px-2 py-1 rounded border border-red-500/20 hover:border-red-500/40 transition-all">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
