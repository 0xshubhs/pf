'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 96
const VOLUME = 14
const CONNECTION_DISTANCE = 2.5
const MOUSE_RADIUS = 4
// Hard cap on drawn connections: keeps the line buffer tiny (a few KB
// uploaded per frame instead of the full N² pair space).
const MAX_LINKS = 600

// Procedural glow circle texture
function createGlowTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const center = size / 2
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center)
  gradient.addColorStop(0, 'rgba(253, 151, 69, 1)')
  gradient.addColorStop(0.3, 'rgba(253, 151, 69, 0.8)')
  gradient.addColorStop(0.7, 'rgba(253, 151, 69, 0.15)')
  gradient.addColorStop(1, 'rgba(253, 151, 69, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

export default function HomeParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const { pointer, viewport } = useThree()

  const glowTexture = useMemo(() => createGlowTexture(), [])

  const { positions, velocities, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * VOLUME
      pos[i * 3 + 1] = (Math.random() - 0.5) * VOLUME
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      vel[i * 3] = (Math.random() - 0.5) * 0.006
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.006
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003
      // Varied sizes for depth
      sz[i] = 0.15 + Math.random() * 0.2
    }
    return { positions: pos, velocities: vel, sizes: sz }
  }, [])

  const linePositions = useMemo(() => new Float32Array(MAX_LINKS * 6), [])
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

    const mouseX = pointer.x * (viewport.width / 2)
    const mouseY = pointer.y * (viewport.height / 2)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      arr[ix] += velocities[ix] + Math.sin(time * 0.3 + i * 0.5) * 0.003
      arr[ix + 1] += velocities[ix + 1] + Math.cos(time * 0.2 + i * 0.5) * 0.003
      arr[ix + 2] += velocities[ix + 2]

      // Mouse attraction (gentle pull toward cursor)
      const dx = mouseX - arr[ix]
      const dy = mouseY - arr[ix + 1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_RADIUS && dist > 0.1) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.015
        arr[ix] += dx * force * 0.1
        arr[ix + 1] += dy * force * 0.1
      }

      // Wrap around
      const half = VOLUME / 2
      if (arr[ix] > half) arr[ix] = -half
      if (arr[ix] < -half) arr[ix] = half
      if (arr[ix + 1] > half) arr[ix + 1] = -half
      if (arr[ix + 1] < -half) arr[ix + 1] = half
      if (arr[ix + 2] > 4) arr[ix + 2] = -4
      if (arr[ix + 2] < -4) arr[ix + 2] = 4
    }
    posAttr.needsUpdate = true

    // Connection lines (capped at MAX_LINKS)
    let lineIdx = 0
    outer: for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = arr[i * 3] - arr[j * 3]
        const dy = arr[i * 3 + 1] - arr[j * 3 + 1]
        const dz = arr[i * 3 + 2] - arr[j * 3 + 2]
        const distSq = dx * dx + dy * dy + dz * dz
        if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
          if (lineIdx + 6 > linePositions.length) break outer
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
      {/* Glow particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial
          color="#FD9745"
          size={0.25}
          transparent
          opacity={0.9}
          sizeAttenuation
          map={glowTexture}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#FD9745"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Ambient glow sphere in center */}
      <mesh position={[0, 0, -2]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#FD9745" transparent opacity={0.02} />
      </mesh>
    </>
  )
}
