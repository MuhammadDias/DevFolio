import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardShell from '@/components/dashboard/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          username={profile?.username ?? ''}
          fullName={profile?.full_name ?? ''}
          avatarUrl={profile?.avatar_url ?? null}
        />
      }
    >
      {children}
    </DashboardShell>
  )
}
