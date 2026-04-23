'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ChevronLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface Props {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export default function DashboardShell({ sidebar, children }: Props) {
  // Default: open on desktop (lg), closed on mobile
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  // Detect mobile and handle initial state
  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    if (isMobile) setIsOpen(false)
  }, [])

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) setIsOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen bg-[#dedede] overflow-hidden relative">
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-[#f6f6f6] transition-all duration-300 ease-in-out border-r border-black/10
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 ${!isOpen ? 'lg:-ml-64' : 'lg:ml-0'}
      `}>
        {/* Desktop Collapse Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-1/2 -right-3 p-1 bg-white border border-black/10 rounded-full text-black/30 hover:text-violet-700 shadow-sm z-[60] hidden lg:flex items-center justify-center transition-all hover:scale-110"
          title="Hide Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-black/40 hover:text-black lg:hidden"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        {sidebar}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header - Always shown when sidebar is closed, and always on mobile */}
        <header className={`
          flex items-center px-4 py-3 bg-[#f6f6f6] border-b border-black/10 transition-all duration-300
          ${!isOpen ? 'h-14 opacity-100' : 'h-14 lg:h-0 lg:opacity-0 lg:pointer-events-none'}
        `}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsOpen(true)}
              className="p-2 -ml-2 text-black hover:bg-violet-100 hover:text-violet-700 rounded-lg transition-all"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            {!isOpen && (
              <span className="text-lg font-black tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                dev<span className="text-violet-700">folio</span>
              </span>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  )
}
