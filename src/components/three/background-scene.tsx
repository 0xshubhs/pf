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

  if (!mounted || shouldReduceMotion || isMobile) return null

  const SceneComponent = scenes[scene]

  return (
    <SceneContainer>
      <SceneComponent />
    </SceneContainer>
  )
}
