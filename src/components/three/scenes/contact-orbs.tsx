'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface OrbProps {
  position: [number, number, number]
  color: string
  radius: number
  pulseSpeed: number
  floatSpeed: number
}

function GlowOrb({ position, color, radius, pulseSpeed, floatSpeed }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const s = 1 + Math.sin(clock.elapsedTime * pulseSpeed) * 0.08
    meshRef.current.scale.setScalar(s)
    if (glowRef.current) {
      glowRef.current.scale.setScalar(s * 1.3)
    }
  })

  return (
    <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={1.2}>
      <group position={position}>
        {/* Inner orb */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
        {/* Outer glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[radius * 1.5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.05} />
        </mesh>
      </group>
    </Float>
  )
}

export default function ContactOrbs() {
  const orbs: OrbProps[] = useMemo(() => [
    { position: [-3, 2, -3], color: '#FD9745', radius: 0.8, pulseSpeed: 1.5, floatSpeed: 1.2 },
    { position: [3.5, -1, -4], color: '#fc7303', radius: 1.2, pulseSpeed: 1.0, floatSpeed: 0.8 },
    { position: [-2, -2.5, -2], color: '#ff8c42', radius: 0.6, pulseSpeed: 2.0, floatSpeed: 1.5 },
    { position: [2, 2.5, -5], color: '#f5a623', radius: 1.0, pulseSpeed: 0.8, floatSpeed: 1.0 },
    { position: [0, -1, -3.5], color: '#FD9745', radius: 0.5, pulseSpeed: 1.8, floatSpeed: 1.3 },
  ], [])

  return (
    <>
      {orbs.map((orb, i) => (
        <GlowOrb key={i} {...orb} />
      ))}
    </>
  )
}
