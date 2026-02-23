'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'

const SceneContainer = dynamic(() => import('./scene-container'), { ssr: false })

const scenes = {
  home: dynamic(() => import('./scenes/home-particles'), { ssr: false }),
  about: dynamic(() => import('./scenes/about-shapes'), { ssr: false }),
  projects: dynamic(() => import('./scenes/projects-grid'), { ssr: false }),
  hacks: dynamic(() => import('./scenes/hacks-orbits'), { ssr: false }),
  contact: dynamic(() => import('./scenes/contact-orbs'), { ssr: false }),
  audits: dynamic(() => import('./scenes/audits-shield'), { ssr: false }),
}

type SceneName = keyof typeof scenes

interface BackgroundSceneProps {
  scene: SceneName
}

// CSS fallback for mobile - floating gradient orbs
function MobileFallback() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute w-72 h-72 rounded-full bg-orange-500/[0.07] blur-3xl animate-float-1 top-[10%] left-[10%]" />
      <div className="absolute w-96 h-96 rounded-full bg-orange-400/[0.05] blur-3xl animate-float-2 top-[50%] right-[5%]" />
      <div className="absolute w-60 h-60 rounded-full bg-orange-600/[0.06] blur-3xl animate-float-3 bottom-[10%] left-[30%]" />
    </div>
  )
}

export default function BackgroundScene({ scene }: BackgroundSceneProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!mounted || shouldReduceMotion) return null

  // Mobile gets CSS-only animated fallback
  if (isMobile) return <MobileFallback />

  const SceneComponent = scenes[scene]

  return (
    <SceneContainer>
      <SceneComponent />
    </SceneContainer>
  )
}
