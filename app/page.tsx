// app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4 text-center">
      {/* Badge */}
      <span className="inline-block px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] text-xs font-bold uppercase tracking-wider mb-6">
        Multi-Tenant Portfolio Platform
      </span>

      {/* Logo */}
      <h1 className="text-6xl font-black tracking-tight text-white mb-4">
        dev<span className="text-[#1DB954]">folio</span>
      </h1>

      <p className="text-[#B3B3B3] text-lg max-w-md mb-10 leading-relaxed">
        Your portfolio, your way. Build and share a beautiful developer portfolio in minutes.
      </p>

      {/* CTA */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/auth/register" className="btn-primary text-base px-8 py-3">
          Get started free
        </Link>
        <Link href="/auth/login" className="btn-secondary text-base px-8 py-3">
          Sign in
        </Link>
      </div>

      {/* Feature bullets */}
      <div className="grid sm:grid-cols-3 gap-4 mt-16 max-w-2xl w-full text-left">
        {[
          { icon: '🔒', title: 'Private by default', desc: 'Your data is isolated with row-level security.' },
          { icon: '🎨', title: 'Beautiful themes', desc: 'Spotify-inspired dark design that looks great.' },
          { icon: '⚡', title: 'Instant deploy', desc: 'Live at yourname.devfolio.app in seconds.' },
        ].map(f => (
          <div key={f.title} className="bg-[#181818] rounded-xl border border-[#2a2a2a] p-5">
            <div className="text-2xl mb-2">{f.icon}</div>
            <h3 className="font-bold text-white text-sm">{f.title}</h3>
            <p className="text-[#B3B3B3] text-xs mt-1 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
