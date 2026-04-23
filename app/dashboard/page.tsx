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
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <p className="text-black/60 text-sm mt-1">Manage your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Projects',   value: projCount ?? 0,  icon: '📁' },
          { label: 'Skills',     value: skillCount ?? 0, icon: '⚡' },
          { label: 'Profile',    value: profile?.full_name ? '✓' : '–', icon: '👤' },
        ].map(s => (
          <div key={s.label} className="card-dark flex flex-row sm:flex-col items-center justify-center gap-4 sm:gap-1 text-center py-4">
            <div className="text-2xl sm:mb-1">{s.icon}</div>
            <div className="text-left sm:text-center">
              <div className="text-xl sm:text-2xl font-bold text-black leading-none">{s.value}</div>
              <div className="text-xs text-black/60 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Public URL banner */}
      <div className="mb-8 px-5 py-4 rounded-xl bg-violet-100 border border-violet-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="overflow-hidden w-full">
          <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-0.5">Your public portfolio</p>
          <p className="text-black text-sm font-medium truncate">
            {process.env.NEXT_PUBLIC_APP_URL}/{profile?.username}
          </p>
        </div>
        <a
          href={`/${profile?.username}`}
          target="_blank"
          className="btn-primary flex-shrink-0 text-xs px-4 py-2 w-full sm:w-auto text-center"
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
