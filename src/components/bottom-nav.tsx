'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, User, FolderGit2, Swords, ShieldCheck, Mail, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import clsx from 'clsx'

// The work tab groups three pages; tap opens the current one, long-press (450ms)
// opens a glass flyout to switch between them.
const WORK_GROUP = [
  { path: '/projects', text: 'projects', Icon: FolderGit2 },
  { path: '/hacks', text: 'hacks', Icon: Swords },
  { path: '/audits', text: 'audits', Icon: ShieldCheck },
]

const HOLD_MS = 450

const tabClass = (active: boolean) =>
  clsx(
    'relative z-10 flex flex-1 select-none flex-col items-center gap-0.5 rounded-xl py-2 transition-colors duration-300',
    active ? 'text-orange-500 dark:text-orange-400' : 'text-gray-600 dark:text-gray-300'
  )

const BottomNav = () => {
  const path = usePathname()
  const router = useRouter()
  const { setTheme } = useTheme()
  const [flyoutOpen, setFlyoutOpen] = useState(false)

  // Toggle off the live DOM state, not resolvedTheme. Brave's fingerprint shield
  // can spoof prefers-color-scheme so resolvedTheme stays undefined, which would
  // make the toggle one-directional. The `dark` class is always ground truth.
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'light' : 'dark')
  }
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heldRef = useRef(false)

  const activeWork = WORK_GROUP.find((w) => w.path === path) ?? WORK_GROUP[0]
  const workActive = WORK_GROUP.some((w) => w.path === path)

  const startHold = () => {
    heldRef.current = false
    holdTimer.current = setTimeout(() => {
      heldRef.current = true
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10)
      setFlyoutOpen(true)
    }, HOLD_MS)
  }

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
  }

  const endHold = () => {
    cancelHold()
    if (!heldRef.current) router.push(activeWork.path)
  }

  return (
    <>
      {/* backdrop to close the flyout on outside tap */}
      <AnimatePresence>
        {flyoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setFlyoutOpen(false)}
          />
        )}
      </AnimatePresence>

      <div
        className="fixed inset-x-4 z-50 lg:hidden"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        {/* long-press flyout */}
        <AnimatePresence>
          {flyoutOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full left-1/2 mb-3 w-48 -translate-x-1/2 rounded-2xl p-2 liquid-glass-nav"
            >
              {WORK_GROUP.map(({ path: p, text, Icon }) => (
                <button
                  key={p}
                  onClick={() => {
                    setFlyoutOpen(false)
                    router.push(p)
                  }}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                    path === p
                      ? 'text-orange-500 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-200'
                  )}
                >
                  <Icon size={16} />
                  {text}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="flex items-center rounded-2xl px-2 py-1 liquid-glass-nav">
          <Link href="/" className={tabClass(path === '/')}>
            <Home size={20} />
            <span className="text-[10px] font-medium">home</span>
          </Link>

          <Link href="/about" className={tabClass(path === '/about')}>
            <User size={20} />
            <span className="text-[10px] font-medium">about</span>
          </Link>

          {/* work group: tap = open, hold = switch */}
          <button
            className={tabClass(workActive)}
            style={{ WebkitTouchCallout: 'none' } as React.CSSProperties}
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
          >
            <activeWork.Icon size={20} />
            <span className="text-[10px] font-medium">{activeWork.text}</span>
            {/* dots hint that this tab holds more */}
            <span className="absolute right-2 top-1.5 flex gap-0.5">
              {WORK_GROUP.map(({ path: p }) => (
                <span
                  key={p}
                  className={clsx(
                    'h-1 w-1 rounded-full',
                    path === p ? 'bg-orange-500 dark:bg-orange-400' : 'bg-gray-400/50'
                  )}
                />
              ))}
            </span>
          </button>

          <Link href="/contact" className={tabClass(path === '/contact')}>
            <Mail size={20} />
            <span className="text-[10px] font-medium">contact</span>
          </Link>

          {/* theme toggle — styled as a tab so it lines up with the rest.
              icons switch via CSS dark: classes to avoid a hydration mismatch. */}
          <button
            className={tabClass(false)}
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <Sun size={20} className="hidden dark:block" />
            <Moon size={20} className="block dark:hidden" />
            <span className="text-[10px] font-medium">theme</span>
          </button>
        </nav>
      </div>
    </>
  )
}

export default BottomNav
