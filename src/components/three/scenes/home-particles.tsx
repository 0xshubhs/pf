'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 150
const VOLUME = 15
const CONNECTION_DISTANCE = 2
const MOUSE_RADIUS = 3

export default function HomeParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const { pointer } = useThree()

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * VOLUME
      pos[i * 3 + 1] = (Math.random() - 0.5) * VOLUME
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      vel[i * 3] = (Math.random() - 0.5) * 0.005
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003
    }
    return { positions: pos, velocities: vel }
  }, [])

  const linePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6), [])
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    geo.setDrawRange(0, 0)
    return geo
  }, [linePositions])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const time = clock.elapsedTime

    // Mouse in world space (approximate)
    const mouseX = pointer.x * 7
    const mouseY = pointer.y * 5

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      // Drift with sinusoidal motion
      arr[ix] += velocities[ix] + Math.sin(time * 0.3 + i) * 0.002
      arr[ix + 1] += velocities[ix + 1] + Math.cos(time * 0.2 + i) * 0.002
      arr[ix + 2] += velocities[ix + 2]

      // Mouse repulsion
      const dx = arr[ix] - mouseX
      const dy = arr[ix + 1] - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02
        arr[ix] += (dx / dist) * force
        arr[ix + 1] += (dy / dist) * force
      }

      // Wrap around boundaries
      if (arr[ix] > VOLUME / 2) arr[ix] = -VOLUME / 2
      if (arr[ix] < -VOLUME / 2) arr[ix] = VOLUME / 2
      if (arr[ix + 1] > VOLUME / 2) arr[ix + 1] = -VOLUME / 2
      if (arr[ix + 1] < -VOLUME / 2) arr[ix + 1] = VOLUME / 2
      if (arr[ix + 2] > 4) arr[ix + 2] = -4
      if (arr[ix + 2] < -4) arr[ix + 2] = 4
    }
    posAttr.needsUpdate = true

    // Build connection lines
    let lineIdx = 0
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = arr[i * 3] - arr[j * 3]
        const dy = arr[i * 3 + 1] - arr[j * 3 + 1]
        const dz = arr[i * 3 + 2] - arr[j * 3 + 2]
        const dist = dx * dx + dy * dy + dz * dz
        if (dist < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
          linePositions[lineIdx++] = arr[i * 3]
          linePositions[lineIdx++] = arr[i * 3 + 1]
          linePositions[lineIdx++] = arr[i * 3 + 2]
          linePositions[lineIdx++] = arr[j * 3]
          linePositions[lineIdx++] = arr[j * 3 + 1]
          linePositions[lineIdx++] = arr[j * 3 + 2]
        }
      }
    }

    if (linesRef.current) {
      const linePosAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
      ;(linePosAttr.array as Float32Array).set(linePositions)
      linePosAttr.needsUpdate = true
      linesRef.current.geometry.setDrawRange(0, lineIdx / 3)
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#FD9745"
          size={0.06}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#FD9745" transparent opacity={0.12} />
      </lineSegments>
    </>
  )
}
