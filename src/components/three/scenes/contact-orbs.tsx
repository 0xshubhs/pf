'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbProps {
  position: [number, number, number]
  color: string
  radius: number
  pulseSpeed: number
  floatSpeed: number
  floatOffset: number
}

function GlowOrb({ position, color, radius, pulseSpeed, floatSpeed, floatOffset }: OrbProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    const pulse = 1 + Math.sin(t * pulseSpeed) * 0.1
    groupRef.current.scale.setScalar(pulse)
    // Float motion
    groupRef.current.position.y = position[1] + Math.sin(t * floatSpeed + floatOffset) * 0.5
    groupRef.current.position.x = position[0] + Math.cos(t * floatSpeed * 0.7 + floatOffset) * 0.3
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Core orb */}
      <mesh>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Mid glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.6, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer haze */}
      <mesh>
        <sphereGeometry args={[radius * 2.5, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function ContactOrbs() {
  const orbs: OrbProps[] = useMemo(() => [
    { position: [-3, 2, -3], color: '#FD9745', radius: 0.8, pulseSpeed: 1.5, floatSpeed: 0.8, floatOffset: 0 },
    { position: [3.5, -1, -4], color: '#fc7303', radius: 1.2, pulseSpeed: 1.0, floatSpeed: 0.6, floatOffset: 2 },
    { position: [-2, -2.5, -2], color: '#ff8c42', radius: 0.6, pulseSpeed: 2.0, floatSpeed: 1.0, floatOffset: 4 },
    { position: [2, 2.5, -5], color: '#f5a623', radius: 1.0, pulseSpeed: 0.8, floatSpeed: 0.7, floatOffset: 1.5 },
    { position: [0, -1, -3.5], color: '#FD9745', radius: 0.5, pulseSpeed: 1.8, floatSpeed: 0.9, floatOffset: 3 },
    { position: [-4.5, 0, -4.5], color: '#fc7303', radius: 0.7, pulseSpeed: 1.2, floatSpeed: 0.5, floatOffset: 5 },
  ], [])

  return (
    <>
      {orbs.map((orb, i) => (
        <GlowOrb key={i} {...orb} />
      ))}
    </>
  )
}
