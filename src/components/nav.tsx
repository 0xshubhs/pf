'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { ThemeSwitcher } from './theme-switcher'

const LINKS = [
  { path: '/about', text: 'about' },
  { path: '/hacks', text: 'hacks' },
  { path: '/projects', text: 'projects' },
  { path: '/audits', text: 'audits' },
  { path: '/contact', text: 'contact' },
]

const Nav = () => {
  const path = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          aria-current={path === '/' ? 'page' : undefined}
          className={clsx(
            'nav-link px-1.5 py-1 text-base font-bold tracking-tight',
            path === '/' ? 'text-accent' : 'text-ink'
          )}
        >
          0xshubhs.eth
        </Link>

        {/* One switcher for every breakpoint, as a direct child of the header row
            rather than nested inside <nav>. The nested desktop copy measured its
            own position differently from the mobile one, which put the droplet's
            origin on the wrong nav item. Same element, same structure, always. */}
        <div className="flex items-center gap-1">
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active = path === link.path
            return (
              <Link
                key={link.path}
                href={link.path}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'nav-link px-2.5 py-1 text-[14px]',
                  active ? 'text-accent' : 'text-ink-dim'
                )}
              >
                {/* The bracket is the active marker — no pill, no underline. */}
                {active ? `[${link.text}]` : link.text}
              </Link>
            )
          })}

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link px-2.5 py-1 text-[14px] text-ink-dim"
          >
            resume
          </a>

        </nav>

        <ThemeSwitcher className="nav-link px-2.5 py-1 text-[14px] text-ink-dim" />
        </div>
      </div>
    </header>
  )
}

export default Nav
