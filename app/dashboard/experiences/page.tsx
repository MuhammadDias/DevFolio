// app/dashboard/experiences/page.tsx
import { createClient } from '@/lib/supabase/server'
import ExperiencesClient from '@/components/dashboard/ExperiencesClient'

export const metadata = { title: 'Experience — Dashboard' }

export default async function ExperiencesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: experiences } = await supabase
    .from('experiences').select('*').eq('user_id', user!.id)
    .order('start_date', { ascending: false })

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Experience</h1>
        <p className="text-black/60 text-sm mt-1">Add your work and education history</p>
      </div>
      <ExperiencesClient initialExperiences={experiences ?? []} userId={user!.id} />
    </div>
  )
}
