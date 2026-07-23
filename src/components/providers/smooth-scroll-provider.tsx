'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

interface LenisContextType {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
})

export const useLenis = () => useContext(LenisContext)

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    // Native scroll for users who asked for less motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    setLenis(instance)

    function raf(time: number) {
      instance.raf(time)
      rafId.current = requestAnimationFrame(raf)
    }

    rafId.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId.current)
      instance.destroy()
    }
  }, [])

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number }
  ) => {
    lenis?.scrollTo(target, options)
  }

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  )
}
