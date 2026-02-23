'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'

interface SceneContainerProps {
  children: React.ReactNode
  className?: string
}

export default function SceneContainer({ children, className = '' }: SceneContainerProps) {
  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none ${className}`}>
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
