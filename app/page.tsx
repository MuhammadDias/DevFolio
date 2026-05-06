// app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HeroScrollDemo } from '@/components/demo/container-scroll-animation-demo'
import { GridPattern } from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'
import { TestimonialsVariant } from '@/components/demo/animated-cards-stack-demo'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#fcfcfd] overflow-x-clip relative">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        squares={[
          [4, 4], [8, 2], [15, 6], [22, 3], [30, 8], [35, 4]
        ]}
        className={cn(
          "[mask-image:radial-gradient(1800px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 fixed z-0",
          "fill-violet-900/[0.08] stroke-violet-900/[0.08]"
        )}
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

        <section className="-mt-20 mb-20 relative z-20">
          <HeroScrollDemo />
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
              { name: "Next.js", desc: "React framework", icon: NextJsIcon },
              { name: "Supabase", desc: "Postgres + Auth", icon: SupabaseIcon },
              { name: "Tailwind CSS", desc: "Utility-first CSS", icon: TailwindIcon },
              { name: "TypeScript", desc: "Type safety", icon: TypeScriptIcon },
              { name: "Vercel", desc: "Global edge network", icon: VercelIcon }
            ].map((tech) => (
              <div key={tech.name} className="text-center group flex flex-col items-center w-32">
                <div className="w-16 h-16 rounded-2xl bg-white border border-black/10 flex items-center justify-center text-2xl font-bold mb-4 shadow-sm group-hover:shadow-[0_15px_35px_-10px_rgba(124,58,237,0.35)] group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-violet-300 group-hover:bg-violet-50 transition-all duration-300 ease-out">
                  <tech.icon className="w-8 h-8 group-hover:text-violet-700 transition-colors" />
                </div>
                <div className="font-semibold text-sm text-black/80 group-hover:text-violet-700 transition-colors">{tech.name}</div>
                <div className="text-black/50 text-xs mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-black/55 text-sm">
            + Row Level Security, realtime subscriptions, file storage, and more.
          </div>
        </section>

        {/* Testimonial / Social proof */}
        <div className="mb-28 -mx-4 sm:-mx-6 md:-mx-10 rounded-[2rem] border border-black/5 shadow-sm">
          <TestimonialsVariant />
        </div>

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
function NextJsIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 180 180" fill="currentColor"><path d="M90 0C40.294 0 0 40.294 0 90s40.294 90 90 90 90-40.294 90-90S139.706 0 90 0zm0 162c-39.764 0-72-32.236-72-72s32.236-72 72-72 72 32.236 72 72-32.236 72-72 72z"/><path d="M129.544 142.11L67.65 60.101V114.5h14.545V81.332l53.111 70.364c-12.75 9.176-28.536 14.61-45.306 14.61-42.348 0-76.814-34.466-76.814-76.814s34.466-76.814 76.814-76.814 76.814 34.466 76.814 76.814c0 13.51-3.483 26.208-9.56 37.072l2.29 3.04z"/></svg>
}
function SupabaseIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="#3ECF8E"><path d="M11.996.002c-.365 0-.712.164-.945.446L.515 13.064c-.397.48-.053 1.205.57 1.205h8.91v9.283c0 .546.666.813 1.047.417L23.49 10.94c.4-.419.1-.115-.55-1.115H14.04V.446c0-.246-.2-.444-.445-.444h-1.599z"/></svg>
}
function TailwindIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="#06B6D4"><path d="M12 5.5c-2.667 0-4.333 1.333-5 4 1-1.333 2.167-1.833 3.5-1.5.76.19 1.305.738 1.906 1.345C13.387 10.334 14.536 11.5 17 11.5c2.667 0 4.333-1.333 5-4-1 1.333-2.167 1.833-3.5 1.5-.76-.19-1.305-.738-1.906-1.345C15.613 6.666 14.464 5.5 12 5.5zM7 12.5c-2.667 0-4.333 1.333-5 4 1-1.333 2.167-1.833 3.5-1.5.76.19 1.305.738 1.906 1.345C8.387 17.334 9.536 18.5 12 18.5c2.667 0 4.333-1.333 5-4-1 1.333-2.167 1.833-3.5 1.5-.76-.19-1.305-.738-1.906-1.345C10.613 13.666 9.464 12.5 7 12.5z"/></svg>
}
function TypeScriptIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="#3178C6"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0H1.125zm16.593 20.354c-1.35 0-2.502-.279-3.456-.837-.954-.558-1.638-1.305-2.052-2.241l2.574-1.512c.324.594.756 1.053 1.296 1.377.54.324 1.152.486 1.836.486 1.278 0 1.917-.414 1.917-1.242 0-.306-.099-.576-.297-.81-.198-.234-.522-.441-.972-.621-.45-.18-1.026-.378-1.728-.594-1.296-.414-2.232-1.017-2.808-1.809-.576-.792-.864-1.764-.864-2.916 0-1.26.432-2.313 1.296-3.159.864-.846 2.052-1.269 3.564-1.269 1.152 0 2.16.234 3.024.702.864.468 1.512 1.116 1.944 1.944l-2.484 1.512c-.27-.45-.63-.81-1.08-1.08-.45-.27-.99-.405-1.62-.405-.954 0-1.584.288-1.584.864 0 .306.108.576.324.81.216.234.558.45 1.026.648.468.198 1.08.414 1.836.648 1.296.432 2.25 1.053 2.862 1.863.612.81.918 1.827.918 3.051 0 1.296-.45 2.376-1.35 3.24-.9 1.278-2.142 1.341-3.699 1.341zm-13.734-11.43v11.16H.504V8.924h10.26v3.258H6.552v7.902h3.42V8.924h-5.988z"/></svg>
}
function VercelIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>
}