'use client'

import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import Nav from '@/components/nav'
import BottomNav from '@/components/bottom-nav'
import Links from '@/components/links'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <Nav />
      <div className="min-h-screen">{children}</div>
      <Links />
      {/* Clearance for the fixed mobile nav. This has to sit AFTER the footer —
          the footer is the last thing on the page, so a spacer above it leaves
          the copyright line sitting underneath the bar. env() covers the home
          indicator on notched phones on top of the bar's own height. */}
      <div
        aria-hidden
        className="lg:hidden"
        style={{ height: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
      />
      <BottomNav />
    </ThemeProvider>
  )
}
