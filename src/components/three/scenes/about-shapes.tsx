'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ShapeProps {
  position: [number, number, number]
  geometry: THREE.BufferGeometry
  speed?: number
  floatOffset?: number
  scale?: number
}

function WireframeShape({ position, geometry, speed = 0.3, floatOffset = 0, scale = 0.6 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    meshRef.current.rotation.y = t * speed
    meshRef.current.rotation.x = t * speed * 0.4
    meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + floatOffset) * 0.4
    if (glowRef.current) {
      glowRef.current.position.y = meshRef.current.position.y
      const s = scale * (1 + Math.sin(t * 1.2 + floatOffset) * 0.05)
      glowRef.current.scale.setScalar(s * 2)
    }
  })

  return (
    <>
      <mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
        <meshBasicMaterial
          color="#FD9745"
          wireframe
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Soft glow behind each shape */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial
          color="#FD9745"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

export default function AboutShapes() {
  const geometries = useMemo(() => ({
    ico: new THREE.IcosahedronGeometry(1, 1),
    octa: new THREE.OctahedronGeometry(1, 0),
    torus: new THREE.TorusGeometry(0.8, 0.25, 8, 20),
    dodeca: new THREE.DodecahedronGeometry(0.8, 0),
  }), [])

  const shapes: ShapeProps[] = [
    { position: [-4, 2, -3], geometry: geometries.ico, speed: 0.25, floatOffset: 0, scale: 0.7 },
    { position: [4, -1.5, -4], geometry: geometries.torus, speed: 0.2, floatOffset: 1.5, scale: 0.55 },
    { position: [-3, -2, -2], geometry: geometries.octa, speed: 0.35, floatOffset: 3, scale: 0.6 },
    { position: [3.5, 2, -3.5], geometry: geometries.dodeca, speed: 0.3, floatOffset: 4.5, scale: 0.6 },
    { position: [0, 3, -5], geometry: geometries.ico, speed: 0.15, floatOffset: 2, scale: 0.5 },
  ]

  return (
    <>
      {shapes.map((shape, i) => (
        <WireframeShape key={i} {...shape} />
      ))}
    </>
  )
}
