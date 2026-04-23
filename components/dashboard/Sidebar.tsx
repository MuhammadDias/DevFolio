'use client'
// components/dashboard/Sidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  username: string
  fullName: string
  avatarUrl: string | null
}

const NAV = [
  { href: '/dashboard',             label: 'Overview',    icon: '⊞' },
  { href: '/dashboard/projects',    label: 'Projects',    icon: '📁' },
  { href: '/dashboard/experiences', label: 'Experience',  icon: '💼' },
  { href: '/dashboard/skills',      label: 'Skills',      icon: '⚡' },
]

export default function DashboardSidebar({ username, fullName, avatarUrl }: Props) {
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside
      className="w-56 flex-shrink-0 bg-[#f6f6f6] flex flex-col h-full border-r border-black/10"
    >
      {/* Logo */}
      <div className="p-5 pb-4">
        <span className="text-xl font-black tracking-tight">dev<span className="text-violet-700">folio</span></span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {NAV.map(item => {
          const active = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${active
                  ? 'bg-violet-100 text-violet-700 border-l-2 border-violet-700'
                  : 'text-black/60 hover:text-black hover:bg-black/5 border-l-2 border-transparent'
                }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Public link */}
      <div className="px-2 pb-2">
        <a
          href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                     text-black/60 hover:text-black hover:bg-black/5 transition-all"
        >
          <span className="text-base">🔗</span>
          View Portfolio
        </a>
      </div>

      {/* Profile footer */}
      <div className="p-3 border-t border-black/10">
        <div className="flex items-center gap-2.5 px-2 py-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden">
            {avatarUrl
              ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              : (fullName?.[0] ?? username?.[0] ?? '?').toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-black truncate">{fullName || username}</div>
            <div className="text-xs text-black/55 truncate">@{username}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-1 text-left px-3 py-2 rounded-lg text-sm text-black/60
                     hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
