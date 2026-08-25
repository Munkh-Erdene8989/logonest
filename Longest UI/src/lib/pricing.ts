import type { PricingType } from "./types"

export type CalcInput = {
  typeId: string
  materialId?: string
  finishId: string
  widthCm: number
  heightCm: number
  quantity: number
}

export type CalcResult = {
  unitLabel: string
  area: number // м² (area горимд)
  perUnit: number // нэгжийн үнэ
  subtotal: number
  finishMultiplier: number
  total: number
  valid: boolean
}

// Тооцоолуурын гол логик — өргөн формат (м²) ба оффсет (ширхэг) хоёуланг дэмжинэ.
export function calculatePrice(
  pricing: PricingType[],
  input: CalcInput,
): CalcResult {
  const type = pricing.find((t) => t.id === input.typeId)
  const empty: CalcResult = {
    unitLabel: "",
    area: 0,
    perUnit: 0,
    subtotal: 0,
    finishMultiplier: 1,
    total: 0,
    valid: false,
  }
  if (!type) return empty

  const finish = type.finishes.find((f) => f.id === input.finishId) ?? type.finishes[0]
  const finishMultiplier = finish?.multiplier ?? 1
  const qty = Math.max(1, input.quantity || 1)

  if (type.mode === "area") {
    const material =
      type.materials?.find((m) => m.id === input.materialId) ?? type.materials?.[0]
    if (!material) return empty
    const area = (input.widthCm / 100) * (input.heightCm / 100)
    if (area <= 0) return { ...empty, unitLabel: "м²" }
    const perUnit = area * material.pricePerM2 * finishMultiplier
    const subtotal = perUnit * qty
    return {
      unitLabel: "м²",
      area,
      perUnit,
      subtotal,
      finishMultiplier,
      total: subtotal,
      valid: true,
    }
  }

  // unit горим (ширхэгээр)
  const base = type.basePricePerUnit ?? 0
  const perUnit = base * finishMultiplier
  const subtotal = perUnit * qty
  return {
    unitLabel: "ш",
    area: 0,
    perUnit,
    subtotal,
    finishMultiplier,
    total: subtotal,
    valid: true,
  }
}
