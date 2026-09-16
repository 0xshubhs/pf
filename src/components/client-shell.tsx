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
      <div className="min-h-screen">
        {children}
        {/* keep page bottoms reachable above the fixed mobile nav */}
        <div aria-hidden className="h-20 lg:hidden" />
      </div>
      <Links />
      <BottomNav />
    </ThemeProvider>
  )
}
