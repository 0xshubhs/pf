'use client'

import React from 'react'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from '@/components/theme-provider'
import SmoothScrollProvider from '@/components/providers/smooth-scroll-provider'
import PageTransition from '@/components/page-transition'
import Nav from '@/components/nav'
import BottomNav from '@/components/bottom-nav'
import Links from '@/components/links'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <SmoothScrollProvider>
          <Nav />
          <PageTransition>
            <div className="text-text dark:text-darkText min-h-screen">
              {children}
              {/* keep page bottoms reachable above the floating mobile nav */}
              <div aria-hidden className="h-24 lg:hidden" />
            </div>
          </PageTransition>
          <BottomNav />
          <Links />
        </SmoothScrollProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
