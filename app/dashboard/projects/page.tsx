// app/dashboard/projects/page.tsx
import { createClient } from '@/lib/supabase/server'
import ProjectsClient from '@/components/dashboard/ProjectsClient'

export const metadata = { title: 'Projects — Dashboard' }

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('user_id', user!.id)
    .order('order_index', { ascending: true })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Projects</h1>
        <p className="text-black/60 text-sm mt-1">Add and manage your portfolio projects</p>
      </div>
      <ProjectsClient initialProjects={projects ?? []} userId={user!.id} />
    </div>
  )
}
