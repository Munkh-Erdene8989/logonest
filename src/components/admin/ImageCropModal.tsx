"use client"

import { useCallback, useEffect, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"
import { Button } from "@/components/ui"

const ASPECT = 4 / 3
const MAX_W = 1600
const MAX_H = 1200

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Зураг уншиж чадсангүй."))
    img.src = src
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

export async function cropToCoverFile(src: string, pixelCrop: Area): Promise<File> {
  const image = await loadImage(src)
  let outW = Math.round(pixelCrop.width)
  let outH = Math.round(pixelCrop.height)

  if (outW > MAX_W) {
    outH = Math.round(outH * (MAX_W / outW))
    outW = MAX_W
  }
  if (outH > MAX_H) {
    outW = Math.round(outW * (MAX_H / outH))
    outH = MAX_H
  }
  outH = Math.round((outW * 3) / 4)

  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, outW)
  canvas.height = Math.max(1, outH)
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas дэмжигдэхгүй.")
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const webp = await canvasToBlob(canvas, "image/webp", 0.82)
  if (webp && webp.size > 0) {
    return new File([webp], "cover.webp", { type: "image/webp" })
  }
  const jpeg = await canvasToBlob(canvas, "image/jpeg", 0.85)
  if (!jpeg) throw new Error("Зураг шахаж чадсангүй.")
  return new File([jpeg], "cover.jpg", { type: "image/jpeg" })
}

export function ImageCropModal({
  src,
  onCancel,
  onConfirm,
}: {
  src: string
  onCancel: () => void
  onConfirm: (file: File) => void
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<Area | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const onCropComplete = useCallback((_cropped: Area, pixels: Area) => {
    setArea(pixels)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  async function confirm() {
    if (!area) return
    setBusy(true)
    setError("")
    try {
      const file = await cropToCoverFile(src, area)
      onConfirm(file)
    } catch {
      setError("Зураг таслахад алдаа гарлаа.")
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/70 p-0 sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="crop-title"
        className="flex max-h-[100dvh] w-full max-w-lg flex-col rounded-t-3xl bg-card sm:max-h-[90vh] sm:rounded-3xl"
      >
        <div className="px-5 pt-5 sm:px-6">
          <h2 id="crop-title" className="font-display text-lg font-extrabold">
            4:3 хэмжээнд таслах
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Зургийг чирж, томруулж харагдах хэсгээ сонгоно уу.
          </p>
        </div>

        <div className="relative mx-5 mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-muted sm:mx-6">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid
          />
        </div>

        <div className="px-5 py-4 sm:px-6">
          <label className="flex items-center gap-3 text-sm">
            <span className="w-16 shrink-0 text-muted-foreground">Томруулах</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.02}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-11 w-full accent-primary"
            />
          </label>
          {error && <p className="mt-2 text-sm text-primary">{error}</p>}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row-reverse">
            <Button className="w-full sm:w-auto" onClick={confirm} loading={busy}>
              Болсон
            </Button>
            <Button className="w-full sm:w-auto" variant="ghost" disabled={busy} onClick={onCancel}>
              Болих
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
