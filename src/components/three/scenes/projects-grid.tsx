'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const GRID_SIZE = 20
const SEGMENTS = 35

export default function ProjectsGrid() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(GRID_SIZE, GRID_SIZE, SEGMENTS, SEGMENTS)
  }, [])

  const originalPositions = useMemo(() => {
    return new Float32Array(geometry.attributes.position.array)
  }, [geometry])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const positions = meshRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = positions.array as Float32Array
    const time = clock.elapsedTime

    const mouseX = pointer.x * GRID_SIZE * 0.5
    const mouseY = pointer.y * GRID_SIZE * 0.5

    for (let i = 0; i < arr.length; i += 3) {
      const x = originalPositions[i]
      const y = originalPositions[i + 1]

      // Base wave
      let z = Math.sin(x * 0.5 + time * 0.8) * Math.cos(y * 0.5 + time * 0.6) * 0.5
      z += Math.sin(x * 0.3 - time * 0.4) * 0.3

      // Mouse interaction ripple
      const dx = x - mouseX
      const dy = y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 5) {
        z += Math.sin(dist * 2 - time * 3) * (1 - dist / 5) * 0.4
      }

      arr[i + 2] = z
    }
    positions.needsUpdate = true
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2.5, 0, 0]}
      position={[0, -2, -3]}
    >
      <meshBasicMaterial
        color="#FD9745"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  )
}
