// app/dashboard/skills/page.tsx
import { createClient } from '@/lib/supabase/server'
import SkillsClient from '@/components/dashboard/SkillsClient'

export const metadata = { title: 'Skills — Dashboard' }

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: skills } = await supabase
    .from('skills').select('*').eq('user_id', user!.id).order('category')

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <p className="text-[#B3B3B3] text-sm mt-1">Showcase your technical skills</p>
      </div>
      <SkillsClient initialSkills={skills ?? []} userId={user!.id} />
    </div>
  )
}
