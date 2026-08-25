"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Info } from "lucide-react"
import { calculatePrice, type CalcInput } from "@/lib/pricing"
import { formatMNT } from "@/lib/format"
import type { PricingType } from "@/lib/types"
import { ButtonLink, Eyebrow, Section, Select, cx } from "@/components/ui"

export function CalculatorForm({ pricing }: { pricing: PricingType[] }) {
  const [typeId, setTypeId] = useState(pricing[0]?.id ?? "")
  const type = pricing.find((t) => t.id === typeId) ?? pricing[0]

  const [materialId, setMaterialId] = useState(type?.materials?.[0]?.id)
  const [finishId, setFinishId] = useState(type?.finishes[0]?.id ?? "none")
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(100)
  const [qty, setQty] = useState(type?.mode === "unit" ? 500 : 1)

  const input: CalcInput = {
    typeId,
    materialId,
    finishId,
    widthCm: width,
    heightCm: height,
    quantity: qty,
  }
  const result = useMemo(() => calculatePrice(pricing, input), [pricing, input])

  function switchType(id: string) {
    const t = pricing.find((x) => x.id === id)
    setTypeId(id)
    setMaterialId(t?.materials?.[0]?.id)
    setFinishId(t?.finishes[0]?.id ?? "none")
    setQty(t?.mode === "unit" ? 500 : 1)
  }

  const orderQuery = `/order?calc=1&type=${typeId}&finish=${finishId}&mat=${materialId ?? ""}&w=${width}&h=${height}&qty=${qty}&total=${Math.round(result.total)}`

  return (
    <Section className="py-14 animate-fade-up">
      <Eyebrow>Тооцоолуур</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        Хэвлэлийн үнэ тооцоолуур
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Хэвлэлийн төрлөө сонгож, хэмжээ болон тоо ширхгээ оруулбал үнэ шууд бодогдоно.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div>
            <span className="mb-2.5 block text-sm font-medium">Хэвлэлийн төрөл</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {pricing.map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchType(t.id)}
                  className={cx(
                    "rounded-xl border p-4 text-left transition-colors",
                    typeId === t.id
                      ? "border-primary bg-accent/40"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="font-display font-bold">{t.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          {type?.mode === "area" && (
            <>
              <Select
                label="Материал"
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
              >
                {type.materials?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {formatMNT(m.pricePerM2)}/м²
                  </option>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <NumberField label="Өргөн (см)" value={width} onChange={setWidth} min={1} />
                <NumberField label="Өндөр (см)" value={height} onChange={setHeight} min={1} />
              </div>
            </>
          )}

          <Select label="Өнгөлгөө / нэмэлт" value={finishId} onChange={(e) => setFinishId(e.target.value)}>
            {type?.finishes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
                {f.multiplier !== 1 ? ` (+${Math.round((f.multiplier - 1) * 100)}%)` : ""}
              </option>
            ))}
          </Select>

          <NumberField
            label={type?.mode === "unit" ? "Тоо ширхэг (ш)" : "Тоо ширхэг"}
            value={qty}
            onChange={setQty}
            min={1}
          />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-ink p-6 text-white sm:p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-white/50">
              Тооцоолсон үнэ
            </span>
            <div className="mt-2 font-display text-4xl font-extrabold text-primary">
              {result.valid ? formatMNT(result.total) : "—"}
            </div>

            <dl className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
              {type?.mode === "area" && (
                <Row label="Талбай" value={`${result.area.toFixed(2)} м²`} />
              )}
              <Row label="Нэгжийн үнэ" value={result.valid ? formatMNT(result.perUnit) : "—"} />
              <Row label="Тоо ширхэг" value={`${qty} ш`} />
              {result.finishMultiplier !== 1 && (
                <Row label="Өнгөлгөө" value={`×${result.finishMultiplier}`} />
              )}
            </dl>

            <ButtonLink href={orderQuery} className="mt-8 w-full" size="lg">
              Энэ үнээр захиалах <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            Тооцоолол нь ойролцоо дүн бөгөөд эцсийн үнэ файл, тоо хэмжээ, нэмэлт үйлчилгээнээс
            хамаарч өөрчлөгдөж болно.
          </p>
        </div>
      </div>
    </Section>
  )
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
        className="h-11 w-full rounded-xl border border-border bg-card px-4 font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-white/50">{label}</dt>
      <dd className="font-mono font-medium">{value}</dd>
    </div>
  )
}
