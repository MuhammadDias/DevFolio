// app/[username]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import {
  Globe,
  Star,
  FolderGit2,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('full_name, bio, avatar_url')
    .eq('username', username)
    .single();
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
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();
  if (!profile) return null;

  const [{ data: projects }, { data: experiences }, { data: skills }] = await Promise.all([
    supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', profile.id)
      .order('order_index'),
    supabase
      .from('experiences')
      .select('*')
      .eq('user_id', profile.id)
      .order('start_date', { ascending: false }),
    supabase
      .from('skills')
      .select('*')
      .eq('user_id', profile.id)
      .order('category'),
  ]);

  return {
    profile,
    projects: projects ?? [],
    experiences: experiences ?? [],
    skills: skills ?? [],
  };
}

function formatDate(d: string | null) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

const LEVEL_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

function groupBy<T>(arr: T[], key: keyof T) {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = String(item[key] ?? 'Other');
    (acc[k] = acc[k] ?? []).push(item);
    return acc;
  }, {});
}

// Custom GitHub icon (since lucide-react doesn't export it in your version)
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// Custom LinkedIn icon
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default async function PublicPortfolioPage({ params }: Props) {
  const { username } = await params;
  const data = await getPortfolioData(username);
  if (!data) notFound();
  const { profile, projects, experiences, skills } = data;

  const skillGroups = groupBy(skills, 'category');
  const featuredProj = projects.filter((p: any) => p.is_featured);
  const otherProj = projects.filter((p: any) => !p.is_featured);
  const topWorks = projects.slice(0, 4);
  const hasContactInfo = Boolean(
    profile.contact_email ||
      profile.contact_phone ||
      profile.address ||
      (profile.map_lat != null && profile.map_lng != null)
  );
  const mapEmbedUrl =
    profile.map_lat != null && profile.map_lng != null
      ? `https://maps.google.com/maps?q=${profile.map_lat},${profile.map_lng}&z=14&output=embed`
      : profile.address
      ? `https://maps.google.com/maps?q=${encodeURIComponent(profile.address)}&z=14&output=embed`
      : null;

  return (
    <div className="min-h-screen bg-[#dedede] text-black antialiased">
      <main className="w-full">
        <section className="overflow-hidden border-b border-black/10 bg-[#f6f6f6]">
          <div
            className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 md:px-10 md:py-12"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          >
            <div className="mb-12 flex items-center justify-between gap-4">
              <div className="text-base font-medium tracking-tight">{profile.username}.io</div>
              <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.18em] md:flex">
                <a href="#home" className="hover:text-violet-700 transition-colors">
                  Home
                </a>
                <a href="#work" className="hover:text-violet-700 transition-colors">
                  Work
                </a>
                <a href="#skills" className="hover:text-violet-700 transition-colors">
                  Skills
                </a>
                {hasContactInfo && (
                  <a href="#contact" className="hover:text-violet-700 transition-colors">
                    Contact
                  </a>
                )}
              </nav>
              <a
                href="#work"
                className="inline-flex items-center gap-1 rounded-full border border-black px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-black hover:text-white transition-colors"
              >
                Start Project <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <div id="home" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-6">
                <p className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-violet-700">
                  Public Portfolio
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  {profile.full_name || profile.username}
                </h1>

                <p className="max-w-2xl text-base leading-relaxed text-black/65 md:text-lg">
                  {profile.bio ||
                    'We help transform ideas into digital experiences that are clear, useful, and easy for people to enjoy.'}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.12em] sm:gap-6 sm:text-sm">
                  <a
                    href="#work"
                    className="inline-flex items-center gap-2 border-b border-black pb-1 hover:text-violet-700 hover:border-violet-700 transition-colors"
                  >
                    View Projects <ArrowUpRight className="h-4 w-4" />
                  </a>
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener" className="hover:text-violet-700">
                      <Globe className="mr-1 inline h-4 w-4" />
                      Website
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener"
                      className="hover:text-violet-700"
                    >
                      <GitHubIcon className="mr-1 inline h-4 w-4" />
                      Github
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.linkedin}`}
                      target="_blank"
                      rel="noopener"
                      className="hover:text-violet-700"
                    >
                      <LinkedInIcon className="mr-1 inline h-4 w-4" />
                      Linkedin
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-black/10 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-xl font-bold">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name ?? profile.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (profile.full_name?.[0] ?? profile.username[0]).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-black/45">Profile</p>
                    <p className="text-lg font-semibold">{profile.full_name || profile.username}</p>
                    <p className="text-sm text-black/55">@{profile.username}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-black/60">
                  This page highlights selected projects, technical skills, and contact details in a clean and concise format.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.slice(0, 5).map((s: any) => (
                    <span
                      key={s.id}
                      className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="border-b border-black/10 bg-[#ececec] py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/25 px-4 py-2 text-sm font-medium">
                <span>03</span>
                <span>Our Works</span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">Selected Projects</p>
            </div>
            {topWorks.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {topWorks.map((p: any) => (
                  <ModernProjectCard key={p.id} project={p} featured={Boolean(p.is_featured)} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-black/10 bg-white px-4 py-6 text-sm text-black/60">
                Projects belum ditambahkan.
              </p>
            )}
          </div>
        </section>

        {skills.length > 0 && (
          <section id="skills" className="border-b border-black/10 bg-[#f4f4f4] py-12 md:py-16">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
              <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-black/50">Tech Stack</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(skillGroups).map(([cat, items]) => (
                  <div key={cat} className="rounded-2xl border border-black/10 bg-white p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-violet-700">{cat}</h4>
                    <div className="mt-3 space-y-3">
                      {(items as any[]).map((s) => (
                        <div key={s.id}>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span>{s.name}</span>
                            <span className="text-black/50">{LEVEL_LABELS[s.level ?? 0]}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                              style={{ width: `${(s.level ?? 0) * 20}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {otherProj.length > 0 && (
          <section className="border-b border-black/10 bg-[#ececec] py-12 md:py-16">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
              <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-black/50">More Projects</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherProj.map((p: any) => (
                  <ModernProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {hasContactInfo && (
          <section id="contact" className="border-b border-black/10 bg-[#f4f4f4] py-12 md:py-16">
            <div className="mx-auto grid max-w-[1400px] gap-6 px-4 sm:px-6 md:grid-cols-2 md:px-10">
              <div className="rounded-2xl border border-black/10 bg-white p-5 md:p-6">
                <h3 className="text-sm uppercase tracking-[0.2em] text-black/50">Contact Me</h3>
                <h4 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
                  Let&apos;s build something useful together
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-black/65">
                  Reach out for collaboration, project opportunities, or general inquiries.
                </p>

                <div className="mt-6 space-y-3 text-sm">
                  {profile.contact_email && (
                    <div className="rounded-xl border border-black/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-black/45">Email</p>
                      <a
                        href={`mailto:${profile.contact_email}`}
                        className="mt-1 inline-flex font-medium hover:text-violet-700"
                      >
                        {profile.contact_email}
                      </a>
                    </div>
                  )}
                  {profile.contact_phone && (
                    <div className="rounded-xl border border-black/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-black/45">Phone</p>
                      <a href={`tel:${profile.contact_phone}`} className="mt-1 inline-flex font-medium hover:text-violet-700">
                        {profile.contact_phone}
                      </a>
                    </div>
                  )}
                  {profile.address && (
                    <div className="rounded-xl border border-black/10 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-black/45">Address</p>
                      <p className="mt-1 font-medium">{profile.address}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                {mapEmbedUrl ? (
                  <iframe
                    title="Location Map"
                    src={mapEmbedUrl}
                    className="h-[360px] w-full md:h-full md:min-h-[420px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-[360px] items-center justify-center text-sm text-black/50 md:h-full md:min-h-[420px]">
                    Map location belum diatur.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <footer className="bg-[#dedede] px-4 py-8 text-center text-xs uppercase tracking-[0.18em] text-black/45 sm:px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">crafted for {profile.full_name || profile.username}</div>
        </footer>
      </main>
    </div>
  );
}

// Modern Project Card Component
function ModernProjectCard({ project, featured }: { project: any; featured?: boolean }) {
  // Small version of GitHub icon for card
  const GitHubIconSmall = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );

  return (
    <div className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-black/90">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FolderGit2 className="h-10 w-10 text-white/40" />
          </div>
        )}
        {featured && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              <Star className="h-2.5 w-2.5 fill-white" /> featured
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        {project.description && (
          <p className="mt-1 line-clamp-2 text-sm text-black/60">{project.description}</p>
        )}
        {project.tech_stack?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech_stack.slice(0, 3).map((t: string) => (
              <span
                key={t}
                className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-3">
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-violet-700 transition-all hover:gap-2"
            >
              preview <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-black/65 transition-all hover:text-black"
            >
              source <GitHubIconSmall className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}