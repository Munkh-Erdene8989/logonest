"use client"

import { Suspense, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { AdaptiveDpr, ContactShadows, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"
import { JerseyModel } from "./JerseyModel"
import { jerseyScroll } from "./jersey-state"
import { createFloorMark } from "./textures"

function StudioCamera() {
  const cam = useRef<THREE.PerspectiveCamera>(null)
  const look = useMemo(() => new THREE.Vector3(), [])
  const mouse = useRef({ x: 0, y: 0 })

  useFrame(({ pointer }) => {
    mouse.current.x += (pointer.x - mouse.current.x) * 0.06
    mouse.current.y += (pointer.y - mouse.current.y) * 0.06
    const c = cam.current
    if (!c) return
    const zMul = typeof window !== "undefined" && window.innerWidth < 768 ? 1.32 : 1
    c.position.set(
      jerseyScroll.camX + mouse.current.x * 0.18,
      jerseyScroll.camY + mouse.current.y * 0.1,
      jerseyScroll.camZ * zMul,
    )
    look.set(
      jerseyScroll.lookX,
      jerseyScroll.lookY + mouse.current.y * 0.04,
      jerseyScroll.lookZ,
    )
    c.lookAt(look)
    c.fov = jerseyScroll.fov
    c.updateProjectionMatrix()
  })

  return (
    <PerspectiveCamera
      ref={cam}
      makeDefault
      fov={32}
      position={[0.12, 0.42, 5.35]}
      near={0.1}
      far={40}
    />
  )
}

function GroundMark() {
  const tex = useMemo(() => createFloorMark(), [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0.4]}>
      <planeGeometry args={[6.5, 6.5]} />
      <meshBasicMaterial map={tex} transparent opacity={0.14} depthWrite={false} />
    </mesh>
  )
}

function BackdropMark() {
  const tex = useMemo(() => createFloorMark(), [])
  return (
    <mesh position={[-2.8, 0.6, -4.2]} rotation={[0, 0.4, 0]}>
      <planeGeometry args={[9, 9]} />
      <meshBasicMaterial map={tex} transparent opacity={0.045} depthWrite={false} />
    </mesh>
  )
}

function Lights() {
  const green = useRef<THREE.SpotLight>(null)
  useFrame(({ clock }) => {
    if (green.current) {
      const pulse = 18 + Math.sin(clock.elapsedTime * 0.7) * 3
      green.current.intensity = pulse + jerseyScroll.vent * 10 + jerseyScroll.stitch * 6
    }
  })
  return (
    <>
      <ambientLight intensity={0.12} color="#9aa8a0" />
      <spotLight
        position={[2.4, 5.2, 3.4]}
        angle={0.55}
        penumbra={0.7}
        intensity={55}
        color="#f4f7f4"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        ref={green}
        position={[3.6, 1.6, 1.2]}
        angle={0.7}
        penumbra={0.85}
        intensity={20}
        color="#08CB00"
      />
      <spotLight
        position={[-3.2, 2.4, 2]}
        angle={0.65}
        penumbra={0.8}
        intensity={12}
        color="#5a6a62"
      />
      <pointLight position={[0, -0.8, 2.2]} intensity={6} color="#08CB00" />
      <directionalLight position={[-2, 4, -3]} intensity={0.35} color="#08CB00" />
    </>
  )
}

function Scene() {
  return (
    <>
      <StudioCamera />
      <Lights />
      <BackdropMark />
      <GroundMark />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.64, 0]} receiveShadow>
        <circleGeometry args={[7, 48]} />
        <meshStandardMaterial color="#0a0c0b" metalness={0.72} roughness={0.28} />
      </mesh>
      <ContactShadows
        position={[0, -1.63, 0]}
        opacity={0.55}
        scale={11}
        blur={2.6}
        far={5}
        color="#000000"
      />
      <JerseyModel />
    </>
  )
}

export function JerseyCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      shadows
      className="h-full w-full"
      style={{ background: "#050505" }}
    >
      <AdaptiveDpr pixelated />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
