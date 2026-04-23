// app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#fcfcfd] overflow-x-hidden relative">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-100/35 via-transparent to-fuchsia-100/20" />
      <div
        className="pointer-events-none fixed inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
        }}
      />

      <main className="relative z-10 mx-auto max-w-[1400px] px-4 py-8 sm:px-6 md:px-10 md:py-12">
        <nav className="mb-16 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight">
            <span>dev</span>
            <span className="text-violet-700">folio</span>
          </h1>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-black/65 transition hover:text-violet-700">
              Sign in
            </Link>
            <Link href="/auth/register" className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition">
              Get started
            </Link>
          </div>
        </nav>

        <section className="relative mb-24 flex min-h-[78svh] items-center py-8 md:min-h-[82svh]">
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <div className="absolute right-[3%] top-[6%] w-[340px] -rotate-[6deg] rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100/85 to-fuchsia-100/80 p-5 shadow-[0_20px_40px_rgba(124,58,237,0.12)]">
              <p className="text-3xl font-semibold leading-tight">
                We deliver <span className="rounded-lg bg-violet-500 px-2 text-white">meaningful</span> digital
                solutions
              </p>
              <span className="mt-4 inline-flex rounded-full border border-violet-300 bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-violet-700">
                HTML
              </span>
            </div>
            <div className="absolute right-[6%] top-[46%] w-[370px] rotate-[2deg] rounded-2xl border border-black/10 bg-[#0f0f14] p-6 text-white shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">01</p>
              <p className="mt-3 text-4xl font-semibold leading-tight">Creative Digital Services</p>
            </div>
            <div className="absolute right-[8%] top-[75%] w-[300px] -rotate-[3deg] rounded-2xl border border-black/10 bg-white/90 p-4 shadow-[0_14px_35px_rgba(0,0,0,0.12)]">
              <p className="text-xs uppercase tracking-[0.25em] text-black/45">Our Services</p>
              <p className="mt-2 text-sm font-semibold">01 Frontend</p>
            </div>
          </div>

          <div className="relative z-10 w-full py-6 md:py-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-100 px-4 py-1.5">
              <SparkIcon className="h-3.5 w-3.5 text-violet-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700">Build Your Public Portfolio</span>
            </div>
            <h1 className="mb-6 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
              Build a portfolio that
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">represents you professionally</span>
            </h1>
            <p className="mb-10 max-w-2xl text-base text-black/65 md:text-xl">
              Create a personal page to share your work, experience, and skills in a clean format that is easy to browse on any device.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/register" className="group inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-4 font-semibold text-white transition hover:bg-violet-700">
                Create your portfolio free
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#features" className="rounded-full border border-black/20 bg-white/80 px-8 py-4 font-semibold hover:bg-black/5 transition">
                See features
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-black/55">
              <span className="inline-flex items-center gap-2"><CheckIcon className="h-4 w-4 text-violet-700" /> No credit card required</span>
              <span className="inline-flex items-center gap-2"><CheckIcon className="h-4 w-4 text-violet-700" /> Free starter plan</span>
            </div>
          </div>
        </section>

        {/* Why portfolio section */}
        <section className="mb-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why a portfolio matters</h2>
            <p className="text-black/60 max-w-2xl mx-auto">A good portfolio helps people quickly understand what you do and what you can deliver.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Stand out from the crowd",
                desc: "90% of developers use the same resume template. A portfolio shows your unique value.",
                icon: <StarIcon className="w-6 h-6" />
              },
              {
                title: "Proof of skills, not just words",
                desc: "Showcase live projects, case studies, and code snippets — tangible evidence of your expertise.",
                icon: <CodeIcon className="w-6 h-6" />
              },
              {
                title: "Control your narrative",
                desc: "Tell your career story your way. Highlight the projects you're proud of, not just job titles.",
                icon: <CompassIcon className="w-6 h-6" />
              }
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-black/10 bg-[#f6f6f6] p-6 transition-all hover:-translate-y-1 hover:border-violet-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-black/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features / Kelebihan DevFolio - tanpa emoji */}
        <section id="features" className="mb-28">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-100 border border-violet-300 rounded-full px-4 py-1.5 mb-4">
              <GiftIcon className="w-3.5 h-3.5 text-violet-700" />
              <span className="text-violet-700 text-xs font-bold uppercase">Why DevFolio?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">More than just a template</h2>
            <p className="text-black/60 max-w-2xl mx-auto">Everything needed to publish and maintain a modern portfolio page.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Instant deployment",
                desc: "Get a live link (yourname.devfolio.app) in seconds after signup. No configuration needed.",
                icon: <RocketIcon className="w-5 h-5" />
              },
              {
                title: "Spotify-inspired themes",
                desc: "Dark, elegant, and customizable. Choose from multiple color schemes to match your brand.",
                icon: <PaletteIcon className="w-5 h-5" />
              },
              {
                title: "Private by default",
                desc: "Row-level security ensures your data is isolated. You control who sees what.",
                icon: <ShieldIcon className="w-5 h-5" />
              },
              {
                title: "Fully responsive",
                desc: "Looks stunning on desktop, tablet, and mobile — recruiters will browse on any device.",
                icon: <PhoneIcon className="w-5 h-5" />
              },
              {
                title: "Built-in blog & projects",
                desc: "Showcase your writing and coding projects in one place. Add tags, images, and live demos.",
                icon: <EditIcon className="w-5 h-5" />
              },
              {
                title: "Easy customization",
                desc: "Edit directly via dashboard — no Git, no hosting hassle. Change colors, fonts, and layout.",
                icon: <SettingsIcon className="w-5 h-5" />
              }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start bg-[#f6f6f6] rounded-xl p-5 border border-black/10 hover:border-violet-300 transition">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700 shrink-0 mt-0.5">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-black/60 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology stack */}
        <section className="mb-28 rounded-3xl border border-black/10 bg-[#f6f6f6] p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Built with modern stack</h2>
            <p className="text-black/60">Reliable, fast, and developer‑friendly technology</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: "Next.js 15", desc: "React framework", color: "white" },
              { name: "Supabase", desc: "Postgres + Auth", color: "#3ECF8E" },
              { name: "Tailwind CSS", desc: "Utility-first CSS", color: "#38BDF8" },
              { name: "TypeScript", desc: "Type safety", color: "#3178C6" },
              { name: "Vercel", desc: "Global edge network", color: "white" }
            ].map((tech) => (
              <div key={tech.name} className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-black/10 flex items-center justify-center text-2xl font-bold mb-2 group-hover:scale-110 transition">
                  {tech.name[0]}
                </div>
                <div className="font-semibold text-sm">{tech.name}</div>
                <div className="text-black/55 text-xs">{tech.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-black/55 text-sm">
            + Row Level Security, realtime subscriptions, file storage, and more.
          </div>
        </section>

        {/* Testimonial / Social proof */}
        <section className="mb-28">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Trusted by developers</h2>
            <p className="text-black/60">Join hundreds who already launched their portfolio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I got my first freelance client within a week of sharing my DevFolio link. It looks professional and saved me hours of coding.", name: "Alex M.", role: "Frontend Developer" },
              { quote: "The dashboard is so intuitive. I could update my projects without touching code. And the Spotify theme is chef's kiss.", name: "Sarah K.", role: "Full Stack Dev" },
              { quote: "Best decision to move away from static site generators. DevFolio handles everything — auth, database, hosting.", name: "Jason L.", role: "CS Student" }
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-black/10 bg-[#f6f6f6] p-6 hover:border-violet-300 transition">
                <QuoteIcon className="w-8 h-8 text-violet-400 mb-3" />
                <p className="text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div className="font-bold text-sm">{t.name}</div>
                <div className="text-black/55 text-xs">{t.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-3xl p-12 border border-violet-200">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build your portfolio?</h2>
          <p className="text-black/65 max-w-lg mx-auto mb-8">Start with a clean template, then personalize it in minutes from your dashboard.</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-violet-600 text-white font-bold px-8 py-4 rounded-full hover:bg-violet-700 transition">
            Start building for free
            <ArrowIcon className="w-4 h-4" />
          </Link>
          <p className="text-black/55 text-xs mt-6">No credit card • Cancel anytime • Free plan includes core features</p>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-black/10 py-8 text-black/60">
          <div className="grid gap-3 text-sm md:grid-cols-2 md:items-end">
            <p>© 2026 DevFolio. All rights reserved.</p>
            <p className="md:text-right">
              About developer: built by the DevFolio team to help anyone publish a portfolio quickly.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

// ========== KOMPONEN ICON (inline SVG) ==========
function SparkIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
}
function ArrowIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
}
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
}
function StarIcon({ className }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
}
function CodeIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
}
function CompassIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
}
function GiftIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
}
function RocketIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2.5 2.5 0 002.5-2.5V3.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9a3 3 0 100 6 3 3 0 000-6z" /></svg>
}
function PaletteIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4v-2a4 4 0 014-4h10a4 4 0 014 4v2a4 4 0 01-4 4H7zM7 7a4 4 0 114-4 4 4 0 01-4 4zM17 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
}
function ShieldIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
}
function PhoneIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
}
function EditIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
}
function SettingsIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
}
function QuoteIcon({ className }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
}