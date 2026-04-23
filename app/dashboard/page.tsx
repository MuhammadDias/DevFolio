// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/dashboard/ProfileForm'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { count: projCount }, { count: skillCount }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('portfolio_items').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('skills').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
  ])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-black/60 text-sm mt-1">Manage your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Projects',   value: projCount ?? 0,  icon: '📁' },
          { label: 'Skills',     value: skillCount ?? 0, icon: '⚡' },
          { label: 'Profile',    value: profile?.full_name ? '✓' : '–', icon: '👤' },
        ].map(s => (
          <div key={s.label} className="card-dark text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-black">{s.value}</div>
            <div className="text-xs text-black/60 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Public URL banner */}
      <div className="mb-8 px-5 py-4 rounded-xl bg-violet-100 border border-violet-300/60 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-0.5">Your public portfolio</p>
          <p className="text-black text-sm font-medium">
            {process.env.NEXT_PUBLIC_APP_URL}/{profile?.username}
          </p>
        </div>
        <a
          href={`/${profile?.username}`}
          target="_blank"
          className="btn-primary flex-shrink-0 text-xs px-4 py-2"
        >
          View live ↗
        </a>
      </div>

      {/* Profile form */}
      <div className="card-dark">
        <h2 className="text-base font-bold text-black mb-5">Edit Profile</h2>
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
