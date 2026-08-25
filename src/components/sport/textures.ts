import * as THREE from "three"

const LN_PATH =
  "M1184.79 427.267H1184.79V727.815H1110.62L1110.6 727.822L1110.59 727.815H1110.21V727.431L959.893 577.613V615.835H885.316V427.267L885.788 427.748L885.742 395.355L1110.21 618.772V427.267H1035.64V353H1184.79V427.267ZM809.576 653.317L923.437 652.968L998.596 727.234L809.576 727.649V727.815H735V353.001H809.576V653.317Z"

function canvasTexture(canvas: HTMLCanvasElement, repeat = 1) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat, repeat)
  tex.needsUpdate = true
  return tex
}

function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    const px = x + r * Math.cos(a)
    const py = y + r * Math.sin(a)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

export function createHoneycombAlbedo(size = 1024) {
  const c = document.createElement("canvas")
  c.width = c.height = size
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#141618"
  ctx.fillRect(0, 0, size, size)

  const hexR = 16
  const h = hexR * Math.sqrt(3)
  ctx.strokeStyle = "rgba(48, 52, 56, 0.95)"
  ctx.lineWidth = 1.15
  ctx.fillStyle = "rgba(22, 24, 26, 0.65)"

  for (let row = -1; row < size / h + 2; row++) {
    for (let col = -1; col < size / (hexR * 1.5) + 2; col++) {
      const x = col * hexR * 1.5
      const y = row * h + (col % 2 ? h / 2 : 0)
      drawHex(ctx, x, y, hexR * 0.92)
      ctx.fill()
      ctx.stroke()
    }
  }
  return canvasTexture(c, 4)
}

export function createHoneycombBump(size = 1024) {
  const c = document.createElement("canvas")
  c.width = c.height = size
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#7a7a7a"
  ctx.fillRect(0, 0, size, size)

  const hexR = 16
  const h = hexR * Math.sqrt(3)
  ctx.strokeStyle = "#cfcfcf"
  ctx.lineWidth = 1.4

  for (let row = -1; row < size / h + 2; row++) {
    for (let col = -1; col < size / (hexR * 1.5) + 2; col++) {
      const x = col * hexR * 1.5
      const y = row * h + (col % 2 ? h / 2 : 0)
      drawHex(ctx, x, y, hexR * 0.92)
      ctx.stroke()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 4)
  tex.needsUpdate = true
  return tex
}

function paintLN(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  color: string,
) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(scale, scale)
  ctx.translate(-735 - 224.9, -353 - 187.4)
  ctx.fillStyle = color
  ctx.fill(new Path2D(LN_PATH))
  ctx.restore()
}

export function createChestLogo() {
  const c = document.createElement("canvas")
  c.width = 1024
  c.height = 1024
  const ctx = c.getContext("2d")!
  paintLN(ctx, 512, 390, 0.72, "#08CB00")
  ctx.fillStyle = "#ffffff"
  ctx.font = "800 78px system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("LOGONEST", 512, 690)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export function createFloorMark() {
  const c = document.createElement("canvas")
  c.width = c.height = 1024
  const ctx = c.getContext("2d")!
  paintLN(ctx, 512, 512, 1.35, "rgba(8, 203, 0, 0.55)")
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export function createHemWordmark() {
  const c = document.createElement("canvas")
  c.width = 256
  c.height = 1024
  const ctx = c.getContext("2d")!
  ctx.translate(128, 512)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = "#ffffff"
  ctx.font = "700 54px system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("LOGONEST", 0, 18)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export function createMeshGrid() {
  const c = document.createElement("canvas")
  c.width = c.height = 512
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "rgba(8, 12, 10, 0.15)"
  ctx.fillRect(0, 0, 512, 512)
  ctx.strokeStyle = "rgba(8, 203, 0, 0.55)"
  ctx.lineWidth = 1
  const step = 18
  for (let i = 0; i <= 512; i += step) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 512)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(512, i)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 3)
  tex.needsUpdate = true
  return tex
}
