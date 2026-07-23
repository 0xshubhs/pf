'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'

interface SceneContainerProps {
  children: React.ReactNode
  className?: string
}

export default function SceneContainer({ children, className = '' }: SceneContainerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fade the decorative scene as content scrolls over it — body text should
  // never compete with background motion for the reader's eye.
  useEffect(() => {
    const onScroll = () => {
      if (!wrapperRef.current) return
      const opacity = Math.max(0.15, 1 - window.scrollY / 600)
      wrapperRef.current.style.opacity = String(opacity)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} className={`fixed inset-0 -z-10 pointer-events-none ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Suspense fallback={null}>
          {children}
          <AdaptiveDpr pixelated />
        </Suspense>
      </Canvas>
    </div>
  )
}
