'use client'

import * as React from 'react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'

const OVERSHOOT = 1.35

export function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { setTheme } = useTheme()

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Read the live DOM rather than resolvedTheme. Brave's fingerprint shield
    // can spoof prefers-color-scheme so resolvedTheme stays undefined, which
    // would make the toggle one-directional. The `dark` class is ground truth.
    const isDark = document.documentElement.classList.contains('dark')
    const next = isDark ? 'light' : 'dark'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Firefox has no startViewTransition — it just gets an instant swap.
    if (!document.startViewTransition || reduced) {
      setTheme(next)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // clientWidth/Height excludes the scrollbar, which is the box the snapshot
    // is sized to — innerWidth would be ~12px too wide here.
    const vw = document.documentElement.clientWidth
    const vh = document.documentElement.clientHeight

    const radius =
      Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y)) * OVERSHOOT
    const bloom = Math.max(rect.width, rect.height) * 1.1

    const root = document.documentElement
    root.style.setProperty('--vt-x', `${x}px`)
    root.style.setProperty('--vt-y', `${y}px`)
    root.style.setProperty('--vt-r', `${radius}px`)
    root.style.setProperty('--vt-r0', `${bloom}px`)

    document.startViewTransition(() => {
      // flushSync forces the theme class onto <html> inside the transition's
      // capture window; a normal async setState would land too late.
      flushSync(() => setTheme(next))
    })
  }

  return (
    <button onClick={toggle} className={className} aria-label="Toggle theme">
      {/* Labels swap via CSS dark: classes, not state — no hydration mismatch. */}
      <span className="hidden dark:inline">[dark]</span>
      <span className="inline dark:hidden">[light]</span>
    </button>
  )
}
