'use client'
// components/dashboard/ProjectsClient.tsx
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PortfolioItem } from '@/lib/types'

interface Props {
  initialProjects: PortfolioItem[]
  userId: string
}

const EMPTY_FORM = {
  title: '', description: '', image_url: '', project_url: '',
  github_url: '', tech_stack: '', order_index: 0, is_featured: false,
}

export default function ProjectsClient({ initialProjects, userId }: Props) {
  const supabase = createClient()
  const [projects, setProjects] = useState(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<PortfolioItem | null>(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)

  function openAdd() {
    setEditing(null); setForm(EMPTY_FORM); setError(null); setShowForm(true)
  }
  function openEdit(p: PortfolioItem) {
    setEditing(p)
    setForm({
      title: p.title, description: p.description ?? '',
      image_url: p.image_url ?? '', project_url: p.project_url ?? '',
      github_url: p.github_url ?? '',
      tech_stack: (p.tech_stack ?? []).join(', '),
      order_index: p.order_index, is_featured: p.is_featured,
    })
    setError(null); setShowForm(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(null)
    try {
      const payload = {
        ...form,
        user_id: userId,
        tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      }
      if (editing) {
        const { data, error: err } = await supabase
          .from('portfolio_items').update(payload).eq('id', editing.id).select().single()
        if (err) throw err
        setProjects(prev => prev.map(p => p.id === editing.id ? data : p))
      } else {
        const { data, error: err } = await supabase
          .from('portfolio_items').insert(payload).select().single()
        if (err) throw err
        setProjects(prev => [...prev, data])
      }
      setShowForm(false)
    } catch (err: any) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    await supabase.from('portfolio_items').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div>
      {/* Add button */}
      <div className="mb-6">
        <button onClick={openAdd} className="btn-primary">+ Add Project</button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-[#181818] rounded-2xl border border-[#2a2a2a] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">{editing ? 'Edit Project' : 'Add Project'}</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs text-[#B3B3B3] mb-1">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} className="input-dark" required />
              </div>
              <div>
                <label className="block text-xs text-[#B3B3B3] mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  className="input-dark resize-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#B3B3B3] mb-1">Image URL</label>
                  <input name="image_url" value={form.image_url} onChange={handleChange} className="input-dark" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs text-[#B3B3B3] mb-1">Live URL</label>
                  <input name="project_url" value={form.project_url} onChange={handleChange} className="input-dark" placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#B3B3B3] mb-1">GitHub URL</label>
                <input name="github_url" value={form.github_url} onChange={handleChange} className="input-dark" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-xs text-[#B3B3B3] mb-1">Tech Stack (comma separated)</label>
                <input name="tech_stack" value={form.tech_stack} onChange={handleChange}
                  className="input-dark" placeholder="React, TypeScript, Tailwind" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-[#B3B3B3] mb-1">Order</label>
                  <input name="order_index" type="number" value={form.order_index} onChange={handleChange} className="input-dark" />
                </div>
                <label className="flex items-center gap-2 text-sm text-[#B3B3B3] cursor-pointer mt-4">
                  <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="accent-[#1DB954]" />
                  Featured
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="card-dark text-center py-12 text-[#B3B3B3]">
          <div className="text-4xl mb-3">📁</div>
          <p className="font-medium text-white">No projects yet</p>
          <p className="text-sm mt-1">Add your first project to showcase your work</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="card-dark flex items-start gap-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-lg bg-[#2a2a2a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {p.image_url
                  ? <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  : <span className="text-2xl">📁</span>
                }
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{p.title}</h3>
                    {p.description && <p className="text-sm text-[#B3B3B3] line-clamp-1 mt-0.5">{p.description}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {p.is_featured && <span className="badge">Featured</span>}
                    <button onClick={() => openEdit(p)} className="text-xs text-[#B3B3B3] hover:text-white px-2 py-1 rounded border border-[#2a2a2a] hover:border-[#444] transition-all">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/20 hover:border-red-500/40 transition-all">Delete</button>
                  </div>
                </div>
                {p.tech_stack && p.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.tech_stack.map(t => <span key={t} className="badge text-xs">{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
