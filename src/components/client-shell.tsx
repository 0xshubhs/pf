'use client'

import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import SmoothScrollProvider from '@/components/providers/smooth-scroll-provider'
import Preloader from '@/components/preloader'
import PageTransition from '@/components/page-transition'
import CustomCursor from '@/components/custom-cursor'
import Nav from '@/components/nav'
import Links from '@/components/links'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <SmoothScrollProvider>
        <Preloader />
        <Nav />
        <PageTransition>
          <div className="text-text dark:text-darkText min-h-screen">
            {children}
          </div>
        </PageTransition>
        <CustomCursor />
        <Links />
      </SmoothScrollProvider>
    </ThemeProvider>
  )
}
