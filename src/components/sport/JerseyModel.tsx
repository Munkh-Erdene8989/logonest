"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { jerseyScroll } from "./jersey-state"
import {
  createChestLogo,
  createHemWordmark,
  createHoneycombAlbedo,
  createHoneycombBump,
  createMeshGrid,
} from "./textures"

function createJerseyShape() {
  const s = new THREE.Shape()
  const hem = 0.92
  const waist = 0.86
  const chest = 1.02
  const armX = 0.6
  const shoulderX = 0.96
  const topY = 2.4
  const vY = 1.98
  const neckX = 0.2

  s.moveTo(-hem, 0.04)
  s.lineTo(-hem * 0.98, 0.38)
  s.bezierCurveTo(-waist, 0.72, -waist * 1.04, 1.08, -chest, 1.3)
  s.bezierCurveTo(-1.2, 1.34, -1.24, 1.56, -armX, 1.74)
  s.bezierCurveTo(-0.68, 1.98, -0.8, 2.24, -shoulderX, topY)
  s.lineTo(-neckX - 0.06, topY)
  s.quadraticCurveTo(-neckX * 0.35, topY - 0.05, 0, vY)
  s.quadraticCurveTo(neckX * 0.35, topY - 0.05, neckX + 0.06, topY)
  s.lineTo(shoulderX, topY)
  s.bezierCurveTo(0.8, 2.24, 0.68, 1.98, armX, 1.74)
  s.bezierCurveTo(1.24, 1.56, 1.2, 1.34, chest, 1.3)
  s.bezierCurveTo(waist * 1.04, 1.08, waist, 0.72, hem * 0.98, 0.38)
  s.lineTo(hem, 0.04)
  s.quadraticCurveTo(0, -0.05, -hem, 0.04)
  return s
}

function sculptTorso(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position
  const midZ = 0.12
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const nx = x / 1.15
    const ny = (y - 1.15) / 1.7
    const bulge = Math.max(0, 1 - nx * nx - ny * ny * 0.55) * 0.32
    const waist = 1 - Math.max(0, 0.08 * Math.cos(((y - 0.4) / 1.6) * Math.PI))
    pos.setX(i, x * waist)
    if (z > midZ) pos.setZ(i, z + bulge)
    else pos.setZ(i, z - bulge * 0.82)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
}

function buildJerseyGeometry() {
  const shape = createJerseyShape()
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.26,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.038,
    bevelSegments: 4,
    curveSegments: 48,
    steps: 2,
  })
  sculptTorso(geo)
  geo.computeBoundingBox()
  const bb = geo.boundingBox!
  geo.translate(
    -(bb.min.x + bb.max.x) / 2,
    -(bb.min.y + bb.max.y) / 2,
    -(bb.min.z + bb.max.z) / 2,
  )
  geo.computeVertexNormals()
  return geo
}

function sideSeam(sign: number, h: number, w: number) {
  const x = sign * w * 0.47
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(x * 0.96, -h * 0.47, 0.03),
    new THREE.Vector3(x * 1.04, -h * 0.12, 0.05),
    new THREE.Vector3(x * 1.06, h * 0.08, 0.05),
    new THREE.Vector3(x * 0.7, h * 0.3, 0.06),
    new THREE.Vector3(x * 0.82, h * 0.45, 0.04),
  ])
}

function attachClothShader(mat: THREE.MeshPhysicalMaterial) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 }
    shader.uniforms.uCloth = { value: 1 }
    shader.vertexShader = `
      uniform float uTime;
      uniform float uCloth;
    ${shader.vertexShader}`.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
       float falloff = 1.0 - smoothstep(0.85, 1.25, transformed.y);
       float wave = sin(transformed.y * 4.2 + uTime * 1.35) * 0.016
                  + cos(transformed.x * 3.1 + uTime * 0.9) * 0.01;
       transformed.z += wave * uCloth * falloff;
       transformed.x += sin(transformed.y * 2.1 + uTime) * 0.007 * uCloth * falloff;`,
    )
    mat.userData.shader = shader
  }
}

export function JerseyModel() {
  const group = useRef<THREE.Group>(null)
  const stitchMat = useRef<THREE.MeshStandardMaterial>(null)
  const ventMat = useRef<THREE.MeshPhysicalMaterial>(null)
  const innerMat = useRef<THREE.MeshBasicMaterial>(null)
  const shoulderMat = useRef<THREE.MeshPhysicalMaterial>(null)

  const { geo, size } = useMemo(() => {
    const geometry = buildJerseyGeometry()
    const bb = geometry.boundingBox!
    return {
      geo: geometry,
      size: {
        w: bb.max.x - bb.min.x,
        h: bb.max.y - bb.min.y,
        d: bb.max.z - bb.min.z,
      },
    }
  }, [])

  const maps = useMemo(
    () => ({
      albedo: createHoneycombAlbedo(),
      bump: createHoneycombBump(),
      logo: createChestLogo(),
      hem: createHemWordmark(),
      mesh: createMeshGrid(),
    }),
    [],
  )

  const seams = useMemo(
    () => ({
      left: new THREE.TubeGeometry(sideSeam(-1, size.h, size.w), 64, 0.008, 10, false),
      right: new THREE.TubeGeometry(sideSeam(1, size.h, size.w), 64, 0.008, 10, false),
    }),
    [size.h, size.w],
  )

  const bodyMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      map: maps.albedo,
      bumpMap: maps.bump,
      bumpScale: 0.045,
      color: "#1a1c1e",
      roughness: 0.58,
      metalness: 0.06,
      clearcoat: 0.18,
      clearcoatRoughness: 0.45,
      sheen: 0.35,
      sheenColor: new THREE.Color("#111111"),
      emissive: new THREE.Color("#08CB00"),
      emissiveIntensity: 0,
    })
    attachClothShader(mat)
    return mat
  }, [maps.albedo, maps.bump])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const g = group.current
    if (g) {
      g.rotation.y = jerseyScroll.rotationY
      g.rotation.x = jerseyScroll.rotationX
      g.rotation.z = jerseyScroll.rotationZ
      g.position.y = Math.sin(t * 0.9) * 0.045
      const explode = jerseyScroll.construct * 0.08
      g.scale.set(1, 1, 1 + explode)
    }
    const shader = bodyMaterial.userData.shader as
      | { uniforms: { uTime: { value: number }; uCloth: { value: number } } }
      | undefined
    if (shader) {
      shader.uniforms.uTime.value = t
      shader.uniforms.uCloth.value = 1 + jerseyScroll.fabric * 0.6
    }
    bodyMaterial.bumpScale = 0.045 + jerseyScroll.fabric * 0.09
    bodyMaterial.emissiveIntensity = jerseyScroll.fabric * 0.12
    if (stitchMat.current) {
      stitchMat.current.emissiveIntensity = 0.12 + jerseyScroll.stitch * 1.7
      stitchMat.current.opacity = 0.35 + jerseyScroll.stitch * 0.6
    }
    if (ventMat.current) {
      ventMat.current.opacity = 0.22 + jerseyScroll.vent * 0.45
      ventMat.current.emissiveIntensity = 0.15 + jerseyScroll.vent * 1.1
    }
    if (innerMat.current) {
      innerMat.current.opacity = jerseyScroll.construct * 0.4
    }
    if (shoulderMat.current) {
      shoulderMat.current.emissiveIntensity = 0.35 + jerseyScroll.stitch * 0.9
    }
  })

  const shoulderY = size.h * 0.42
  const shoulderX = size.w * 0.38

  return (
    <group ref={group}>
      <mesh geometry={geo} material={bodyMaterial} castShadow receiveShadow />

      <mesh geometry={geo} scale={[0.93, 0.93, 0.62]}>
        <meshBasicMaterial
          ref={innerMat}
          color="#08CB00"
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.08, size.d * 0.52]} scale={[0.78, 0.78, 1]}>
        <planeGeometry args={[1.15, 1.15]} />
        <meshBasicMaterial map={maps.logo} transparent depthWrite={false} />
      </mesh>

      <mesh position={[-shoulderX, shoulderY, 0.13]} rotation={[0.45, 0.35, 0.18]}>
        <boxGeometry args={[0.4, 0.11, 0.035]} />
        <meshPhysicalMaterial
          ref={shoulderMat}
          color="#08CB00"
          emissive="#08CB00"
          emissiveIntensity={0.4}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>
      <mesh position={[shoulderX, shoulderY, 0.13]} rotation={[0.45, -0.35, -0.18]}>
        <boxGeometry args={[0.4, 0.11, 0.035]} />
        <meshPhysicalMaterial
          color="#08CB00"
          emissive="#08CB00"
          emissiveIntensity={0.4}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      <mesh geometry={seams.left}>
        <meshStandardMaterial
          ref={stitchMat}
          color="#08CB00"
          emissive="#08CB00"
          emissiveIntensity={0.3}
          roughness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh geometry={seams.right}>
        <meshStandardMaterial
          color="#08CB00"
          emissive="#08CB00"
          emissiveIntensity={0.3}
          roughness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh position={[-size.w * 0.48, -0.05, 0.02]} rotation={[0, Math.PI * 0.42, 0]}>
        <planeGeometry args={[0.28, 1.35]} />
        <meshPhysicalMaterial
          ref={ventMat}
          map={maps.mesh}
          color="#08CB00"
          emissive="#08CB00"
          emissiveIntensity={0.2}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[size.w * 0.48, -0.05, 0.02]} rotation={[0, -Math.PI * 0.42, 0]}>
        <planeGeometry args={[0.28, 1.35]} />
        <meshPhysicalMaterial
          map={maps.mesh}
          color="#08CB00"
          emissive="#08CB00"
          emissiveIntensity={0.2}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[size.w * 0.42, -size.h * 0.32, size.d * 0.48]}>
        <planeGeometry args={[0.08, 0.7]} />
        <meshBasicMaterial map={maps.hem} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
