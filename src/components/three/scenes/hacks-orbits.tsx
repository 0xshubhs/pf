'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = Math.sin(angle) * radius
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
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FD9745"
          size={size}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default function HacksOrbits() {
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!coreRef.current) return
    coreRef.current.rotation.y = clock.elapsedTime * 0.5
    coreRef.current.rotation.x = clock.elapsedTime * 0.3
    const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.05
    coreRef.current.scale.setScalar(s)
  })

  return (
    <>
      {/* Central glowing shape */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#FD9745" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Glow behind center */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#FD9745" transparent opacity={0.05} />
      </mesh>

      {/* Orbital rings */}
      <ParticleRing radius={2} count={70} speed={0.3} tiltX={0.3} tiltZ={0} size={0.04} />
      <ParticleRing radius={3.5} count={90} speed={-0.2} tiltX={-0.5} tiltZ={0.4} size={0.035} />
      <ParticleRing radius={5} count={110} speed={0.15} tiltX={0.8} tiltZ={-0.3} size={0.03} />
    </>
  )
}
