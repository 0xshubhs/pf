'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural glow dot texture
function createDotTexture() {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const center = size / 2
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center)
  gradient.addColorStop(0, 'rgba(253, 151, 69, 1)')
  gradient.addColorStop(0.4, 'rgba(253, 151, 69, 0.6)')
  gradient.addColorStop(1, 'rgba(253, 151, 69, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

interface RingProps {
  radius: number
  count: number
  speed: number
  tiltX: number
  tiltZ: number
  size: number
}

function ParticleRing({ radius, count, speed, tiltX, tiltZ, size }: RingProps) {
  const groupRef = useRef<THREE.Group>(null)
  const dotTexture = useMemo(() => createDotTexture(), [])

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      arr[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.15
      arr[i * 3 + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.15
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    }
    return arr
  }, [count, radius])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z = clock.elapsedTime * speed
  })

  return (
    <group ref={groupRef} rotation={[tiltX, 0, tiltZ]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#FD9745"
          size={size}
          transparent
          opacity={0.85}
          sizeAttenuation
          map={dotTexture}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Ring wireframe for visual structure */}
      <mesh>
        <torusGeometry args={[radius, 0.008, 4, 80]} />
        <meshBasicMaterial
          color="#FD9745"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function HacksOrbits() {
  const coreRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.5
      coreRef.current.rotation.x = t * 0.3
      const s = 1 + Math.sin(t * 2) * 0.06
      coreRef.current.scale.setScalar(s)
    }
    if (glowRef.current) {
      const g = 1 + Math.sin(t * 1.5) * 0.1
      glowRef.current.scale.setScalar(g)
    }
  })

  return (
    <>
      {/* Central glowing shape */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial color="#FD9745" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Pulsing glow behind center */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial
          color="#FD9745"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbital rings with glow particles */}
      <ParticleRing radius={2} count={80} speed={0.3} tiltX={0.3} tiltZ={0} size={0.12} />
      <ParticleRing radius={3.5} count={100} speed={-0.2} tiltX={-0.5} tiltZ={0.4} size={0.1} />
      <ParticleRing radius={5} count={120} speed={0.15} tiltX={0.8} tiltZ={-0.3} size={0.08} />
    </>
  )
}
