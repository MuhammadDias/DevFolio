// app/[username]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('full_name, bio, avatar_url').eq('username', username).single();
  if (!data) return { title: 'Portfolio not found' };
  return {
    title: `${data.full_name || username} — Portfolio`,
    description: data.bio ?? `Check out ${username}'s portfolio`,
    openGraph: {
      title: `${data.full_name || username} — Portfolio`,
      description: data.bio ?? '',
      images: data.avatar_url ? [data.avatar_url] : [],
    },
  };
}

async function getPortfolioData(username: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single();
  if (!profile) return null;

  const [{ data: projects }, { data: experiences }, { data: skills }] = await Promise.all([
    supabase.from('portfolio_items').select('*').eq('user_id', profile.id).order('order_index'),
    supabase.from('experiences').select('*').eq('user_id', profile.id).order('start_date', { ascending: false }),
    supabase.from('skills').select('*').eq('user_id', profile.id).order('category'),
  ]);

  return { profile, projects: projects ?? [], experiences: experiences ?? [], skills: skills ?? [] };
}

function formatDate(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const LEVEL_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

function groupBy<T>(arr: T[], key: keyof T) {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(item[key] ?? 'Other');
    (acc[k] = acc[k] ?? []).push(item);
    return acc;
  }, {});
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { username } = await params;
  const data = await getPortfolioData(username);
  if (!data) notFound();
  const { profile, projects, experiences, skills } = data;

  const skillGroups = groupBy(skills, 'category');
  const featuredProj = projects.filter((p: any) => p.is_featured);
  const otherProj = projects.filter((p: any) => !p.is_featured);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/8 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-16 relative">
          <div className="flex items-end gap-6 flex-wrap">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1DB954] to-[#17a844] flex items-center justify-center text-3xl font-black text-black flex-shrink-0 overflow-hidden shadow-2xl">
              {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name ?? ''} className="w-full h-full object-cover" /> : (profile.full_name?.[0] ?? profile.username[0]).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-[#1DB954] uppercase tracking-widest mb-1">Portfolio</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile.full_name || profile.username}</h1>
              {profile.bio && <p className="text-[#B3B3B3] mt-2 max-w-xl leading-relaxed">{profile.bio}</p>}
              <div className="flex gap-3 mt-4 flex-wrap">
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener" className="text-sm text-[#B3B3B3] hover:text-[#1DB954] transition-colors">
                    🌐 Website
                  </a>
                )}
                {profile.github && (
                  <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener" className="text-sm text-[#B3B3B3] hover:text-[#1DB954] transition-colors">
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener" className="text-sm text-[#B3B3B3] hover:text-[#1DB954] transition-colors">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        {featuredProj.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-widest mb-5">Featured</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredProj.map((p: any) => (
                <ProjectCard key={p.id} project={p} featured />
              ))}
            </div>
          </section>
        )}
        {otherProj.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-widest mb-5">Projects</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {otherProj.map((p: any) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
        {skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-widest mb-5">Skills</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(skillGroups).map(([cat, items]) => (
                <div key={cat} className="bg-[#181818] rounded-xl border border-[#2a2a2a] p-5">
                  <h3 className="text-xs font-bold text-[#B3B3B3] uppercase tracking-wider mb-3">{cat}</h3>
                  <div className="space-y-2.5">
                    {(items as any[]).map((s) => (
                      <div key={s.id} className="flex items-center gap-3">
                        <span className="text-sm text-white w-28 flex-shrink-0 font-medium">{s.name}</span>
                        <div className="flex-1 flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex-1 h-1 rounded-full" style={{ background: i <= (s.level ?? 0) ? '#1DB954' : '#2a2a2a' }} />
                          ))}
                        </div>
                        <span className="text-xs text-[#B3B3B3] w-20 text-right">{LEVEL_LABELS[s.level ?? 0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-[#B3B3B3] uppercase tracking-widest mb-5">Experience</h2>
            <div className="space-y-3">
              {experiences.map((ex: any) => (
                <div key={ex.id} className="bg-[#181818] rounded-xl border border-[#2a2a2a] p-5 flex gap-4">
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1DB954]" />
                    <div className="flex-1 w-px bg-[#2a2a2a] mt-2" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-bold text-white">{ex.position}</h3>
                        <p className="text-[#1DB954] text-sm font-medium">{ex.company}</p>
                        {ex.location && <p className="text-xs text-[#B3B3B3]">{ex.location}</p>}
                      </div>
                      <p className="text-xs text-[#B3B3B3] font-medium flex-shrink-0">
                        {formatDate(ex.start_date)} – {ex.is_current ? 'Present' : formatDate(ex.end_date)}
                      </p>
                    </div>
                    {ex.description && <p className="text-sm text-[#B3B3B3] mt-2 leading-relaxed">{ex.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <footer className="border-t border-[#1a1a1a] py-6 text-center text-xs text-[#B3B3B3]">
        Built with <span className="text-[#1DB954] font-semibold">devfolio</span>
      </footer>
    </div>
  );
}

function ProjectCard({ project: p, featured }: { project: any; featured?: boolean }) {
  return (
    <div className={`group bg-[#181818] rounded-xl border border-[#2a2a2a] overflow-hidden hover:border-[#1DB954]/30 hover:-translate-y-1 transition-all duration-200`}>
      <div className="aspect-video bg-[#242424] overflow-hidden relative">
        {p.image_url ? (
          <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">📁</div>
        )}
        {featured && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#1DB954]/90 text-black">Featured</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white mb-1">{p.title}</h3>
        {p.description && <p className="text-sm text-[#B3B3B3] line-clamp-2 leading-relaxed">{p.description}</p>}
        {p.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {p.tech_stack.slice(0, 4).map((t: string) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/15 font-medium">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-4">
          {p.project_url && (
            <a href={p.project_url} target="_blank" rel="noopener" className="text-xs font-semibold text-[#1DB954] hover:underline">
              Live ↗
            </a>
          )}
          {p.github_url && (
            <a href={p.github_url} target="_blank" rel="noopener" className="text-xs font-semibold text-[#B3B3B3] hover:text-white">
              GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
