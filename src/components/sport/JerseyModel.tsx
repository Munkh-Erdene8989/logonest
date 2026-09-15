"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { jerseyScroll } from "./jersey-state"

const JERSEY_URL = "/jersey/jersey.glb"
const BASE_SCALE = 2.45

function attachClothShader(mat: THREE.MeshStandardMaterial) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 }
    shader.uniforms.uCloth = { value: 1 }
    shader.vertexShader = `
      uniform float uTime;
      uniform float uCloth;
    ${shader.vertexShader}`.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
       float falloff = 1.0 - smoothstep(0.05, 0.48, transformed.y);
       float wave = sin(transformed.y * 8.0 + uTime * 1.35) * 0.006
                  + cos(transformed.x * 6.0 + uTime * 0.9) * 0.003;
       transformed.z += wave * uCloth * falloff;
       transformed.x += sin(transformed.y * 4.0 + uTime) * 0.002 * uCloth * falloff;`,
    )
    mat.userData.shader = shader
  }
}

export function JerseyModel() {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(JERSEY_URL)

  const jersey = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const m of mats) {
        if (!m) continue
        const mat = m as THREE.MeshStandardMaterial
        mat.side = THREE.DoubleSide
        mat.metalness = 0.12
        mat.roughness = 0.58
        mat.envMapIntensity = 0.7
        mat.emissive = new THREE.Color("#000000")
        mat.emissiveIntensity = 0
        attachClothShader(mat)
      }
    })
    return cloned
  }, [scene])

  const bodyMaterial = useMemo(() => {
    let found: THREE.MeshStandardMaterial | undefined
    jersey.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh || found) return
      const mesh = child as THREE.Mesh
      const m = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
      if (m) found = m as THREE.MeshStandardMaterial
    })
    return found
  }, [jersey])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const g = group.current
    if (g) {
      g.rotation.y = jerseyScroll.rotationY
      g.rotation.x = jerseyScroll.rotationX
      g.rotation.z = jerseyScroll.rotationZ
      g.position.y = Math.sin(t * 0.9) * 0.045
      const explode = jerseyScroll.construct * 0.08
      g.scale.set(BASE_SCALE, BASE_SCALE, BASE_SCALE * (1 + explode))
    }
    const shader = bodyMaterial?.userData.shader as
      | { uniforms: { uTime: { value: number }; uCloth: { value: number } } }
      | undefined
    if (shader) {
      shader.uniforms.uTime.value = t
      shader.uniforms.uCloth.value = 1 + jerseyScroll.fabric * 0.6
    }
    if (bodyMaterial) {
      bodyMaterial.envMapIntensity =
        0.7 + jerseyScroll.fabric * 0.4 + jerseyScroll.vent * 0.2
    }
  })

  return (
    <group ref={group} scale={BASE_SCALE}>
      <primitive object={jersey} />
    </group>
  )
}

useGLTF.preload(JERSEY_URL)
