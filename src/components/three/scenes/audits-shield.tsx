'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AuditsShield() {
  const coreRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.4
      coreRef.current.rotation.x = t * 0.2
      const s = 1 + Math.sin(t * 1.5) * 0.05
      coreRef.current.scale.setScalar(s)
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.6
      ring1Ref.current.rotation.z = t * 0.3
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.5
      ring2Ref.current.rotation.x = t * -0.2
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * -0.4
      ring3Ref.current.rotation.y = t * 0.3
    }
    if (glowRef.current) {
      const g = 1 + Math.sin(t * 1) * 0.08
      glowRef.current.scale.setScalar(g)
    }
  })

  return (
    <>
      {/* Central icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial
          color="#FD9745"
          wireframe
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Central glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial
          color="#FD9745"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Concentric rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2, 0.025, 8, 80]} />
        <meshBasicMaterial
          color="#FD9745"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.02, 8, 80]} />
        <meshBasicMaterial
          color="#FD9745"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.5, 0.015, 8, 80]} />
        <meshBasicMaterial
          color="#FD9745"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
