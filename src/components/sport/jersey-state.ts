export type JerseyScrollState = {
  rotationY: number
  rotationX: number
  rotationZ: number
  camX: number
  camY: number
  camZ: number
  lookX: number
  lookY: number
  lookZ: number
  fov: number
  fabric: number
  stitch: number
  vent: number
  construct: number
  progress: number
}

export const jerseyScroll: JerseyScrollState = {
  rotationY: 0.22,
  rotationX: 0.06,
  rotationZ: 0,
  camX: 0.12,
  camY: 0.42,
  camZ: 5.35,
  lookX: 0,
  lookY: 0.12,
  lookZ: 0,
  fov: 32,
  fabric: 0,
  stitch: 0,
  vent: 0,
  construct: 0,
  progress: 0,
}
