'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AuditsShield() {
  const coreRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.4
      coreRef.current.rotation.x = t * 0.2
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
  })

  return (
    <>
      {/* Central icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#FD9745" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Concentric rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.02, 8, 60]} />
        <meshBasicMaterial color="#FD9745" transparent opacity={0.2} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.02, 8, 60]} />
        <meshBasicMaterial color="#FD9745" transparent opacity={0.15} />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.2, 0.015, 8, 60]} />
        <meshBasicMaterial color="#FD9745" transparent opacity={0.1} />
      </mesh>
    </>
  )
}
