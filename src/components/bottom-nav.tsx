'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

// Flat list, no long-press flyout, no grouped tabs. Every page is one tap.
const TABS = [
  { path: '/', text: 'home' },
  { path: '/about', text: 'about' },
  { path: '/projects', text: 'work' },
  { path: '/hacks', text: 'hacks' },
  { path: '/audits', text: 'audits' },
  { path: '/contact', text: 'contact' },
]

const BottomNav = () => {
  const path = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-rule bg-paper lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {TABS.map((tab) => {
          const active = path === tab.path
          return (
            <Link
              key={tab.path}
              href={tab.path}
              aria-current={active ? 'page' : undefined}
              className={clsx(
                // 6 tabs across 320px leaves ~53px each; "contact" at 10px mono
                // is ~42px, so it clears with room. Bumps up from sm.
                'min-w-0 flex-1 truncate border-l border-rule-soft px-0.5 py-3 text-center text-[10px] first:border-l-0 min-[360px]:text-[11px] sm:text-[12px]',
                active ? 'bg-ink text-paper' : 'text-ink-dim'
              )}
            >
              {tab.text}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
