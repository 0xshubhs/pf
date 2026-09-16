'use client'

import * as React from 'react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'

// With the origin anywhere inside the box, the distance to the farthest corner
// is at most the full diagonal. A circle() percentage radius resolves against
// diagonal/sqrt(2), so 142% (~sqrt(2)) always reaches it — whatever the box's
// actual size turns out to be.
const FULL_RADIUS_PCT = 142

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

    // Everything below is expressed as a PERCENTAGE, deliberately.
    //
    // The clip-path resolves against ::view-transition-new(root)'s box, which is
    // a snapshot — not guaranteed to be the same size as the viewport. When it
    // isn't, a pixel coordinate is scaled by boxWidth/viewportWidth and the
    // origin slides sideways, proportionally to its distance from the left edge.
    // (Which is why it showed up as a large horizontal drift and no visible
    // vertical one: the toggle sits ~28px from the top, so the same ratio is
    // only a few pixels there.) A percentage is relative to that box, so it maps
    // onto the same visual point no matter what size the box is.
    const vw = document.documentElement.clientWidth
    const vh = document.documentElement.clientHeight

    // circle() percentage radii resolve against this reference length.
    const ref = Math.hypot(vw, vh) / Math.SQRT2
    const bloomPct = ((Math.max(rect.width, rect.height) * 1.1) / ref) * 100

    const root = document.documentElement
    root.style.setProperty('--vt-x', `${(x / vw) * 100}%`)
    root.style.setProperty('--vt-y', `${(y / vh) * 100}%`)
    root.style.setProperty('--vt-r', `${FULL_RADIUS_PCT}%`)
    root.style.setProperty('--vt-r0', `${bloomPct}%`)

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
