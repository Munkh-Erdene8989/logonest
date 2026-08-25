import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Check, CheckCircle2, Copy, FileUp, Package } from "lucide-react"
import { useStore } from "../lib/store"
import { calculatePrice } from "../lib/pricing"
import { copyText, formatMNT, makeOrderCode } from "../lib/format"
import type { Order } from "../lib/types"
import { Button, ButtonLink, Eyebrow, Input, Section, Select, Textarea, cx } from "../components/ui"

const STEPS = ["Бүтээгдэхүүн", "Файл", "Холбоо барих", "Баталгаажуулах"]

export default function OrderPage() {
  const { products, pricing, addOrder } = useStore()
  const [params] = useSearchParams()

  const [step, setStep] = useState(0)
  const [productId, setProductId] = useState(params.get("product") ?? products[0]?.id ?? "")
  const [qty, setQty] = useState(Number(params.get("qty")) || 1)
  const [note, setNote] = useState("")
  const [fileName, setFileName] = useState<string | undefined>()
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", note: "" })
  const [placed, setPlaced] = useState<Order | null>(null)
  const [copied, setCopied] = useState(false)

  const product = products.find((p) => p.id === productId)

  // Тооцоолуураас ирсэн бол тэр дүнг ашиглана
  const fromCalc = params.get("calc") === "1"
  const calcTotal = Number(params.get("total")) || 0

  const total = useMemo(() => {
    if (fromCalc && calcTotal) return calcTotal
    if (!product) return 0
    return product.basePrice * Math.max(1, qty)
  }, [fromCalc, calcTotal, product, qty])

  const spec = useMemo(() => {
    if (fromCalc) {
      const t = pricing.find((x) => x.id === params.get("type"))
      const mat = t?.materials?.find((m) => m.id === params.get("mat"))
      const fin = t?.finishes.find((f) => f.id === params.get("finish"))
      const parts = [t?.name]
      if (params.get("w") && params.get("h"))
        parts.push(`${params.get("w")}x${params.get("h")}см`)
      if (mat) parts.push(mat.name)
      if (fin && fin.multiplier !== 1) parts.push(fin.name)
      return parts.filter(Boolean).join(" · ")
    }
    return `${qty}ш · ${product?.tagline ?? ""}`
  }, [fromCalc, params, pricing, qty, product])

  const productName = fromCalc
    ? pricing.find((x) => x.id === params.get("type"))?.name ?? "Захиалга"
    : product?.name ?? "Захиалга"

  function place() {
    const order: Order = {
      code: makeOrderCode(),
      createdAt: new Date().toISOString(),
      status: "received",
      productName,
      spec,
      quantity: fromCalc ? Number(params.get("qty")) || 1 : qty,
      total,
      customer,
      fileName,
      timeline: [
        { status: "received", at: new Date().toISOString(), note: "Захиалга хүлээн авлаа" },
      ],
    }
    addOrder(order)
    setPlaced(order)
  }

  const canContact = customer.name && customer.phone.length >= 6

  if (placed) {
    return (
      <Section className="py-20 animate-fade-up">
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-2xl font-extrabold">Захиалга амжилттай!</h1>
          <p className="mt-2 text-muted-foreground">
            Таны захиалгын дугаар. Үүгээр эсвэл утас/имэйлээрээ явцаа хянаж болно.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-dashed border-primary/40 bg-accent/30 px-5 py-4">
            <span className="font-mono text-2xl font-bold text-primary">{placed.code}</span>
            <button
              onClick={async () => {
                await copyText(placed.code)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card hover:border-primary"
              aria-label="Хуулах"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Нийт дүн: <b className="text-foreground">{formatMNT(placed.total)}</b>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <ButtonLink to={`/track?code=${placed.code}`} size="md">
              Захиалгын явц харах
            </ButtonLink>
            <ButtonLink to="/products" variant="outline" size="md">
              Үргэлжлүүлэн үзэх
            </ButtonLink>
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section className="py-14 animate-fade-up">
      <Eyebrow>Захиалга</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">Захиалга хийх</h1>
      <p className="mt-2 text-muted-foreground">Нэвтрэх шаардлагагүй — хэдхэн алхмаар.</p>

      {/* Stepper */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={cx(
                "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground",
              )}
            >
              <span className="font-mono">{i < step ? "✓" : i + 1}</span>
              {s}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-border" />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Step 0 */}
          {step === 0 && (
            <div className="space-y-5">
              {fromCalc ? (
                <div className="rounded-xl bg-accent/40 p-4">
                  <p className="text-sm text-muted-foreground">Тооцоолуураас</p>
                  <p className="mt-1 font-display font-bold">{productName}</p>
                  <p className="text-sm text-muted-foreground">{spec}</p>
                </div>
              ) : (
                <>
                  <Select
                    label="Бүтээгдэхүүн"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatMNT(p.basePrice)}/{p.unit}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Тоо ширхэг"
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  />
                </>
              )}
              <Textarea
                label="Нэмэлт тайлбар (заавал биш)"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Онцгой хүсэлт, тэмдэглэл..."
              />
              <div className="flex justify-end">
                <Button onClick={() => setStep(1)}>Үргэлжлүүлэх</Button>
              </div>
            </div>
          )}

          {/* Step 1 - file */}
          {step === 1 && (
            <div className="space-y-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border py-12 text-center transition-colors hover:border-primary hover:bg-accent/20">
                <FileUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Дизайн файлаа хавсаргах</p>
                  <p className="text-sm text-muted-foreground">PDF, AI, PSD, JPG (demo)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name)}
                />
                {fileName && (
                  <span className="mt-1 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                    {fileName}
                  </span>
                )}
              </label>
              <p className="text-sm text-muted-foreground">
                Файл байхгүй бол алгасаж болно — манай дизайнер тантай холбогдоно.
              </p>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(0)}>Буцах</Button>
                <Button onClick={() => setStep(2)}>Үргэлжлүүлэх</Button>
              </div>
            </div>
          )}

          {/* Step 2 - contact */}
          {step === 2 && (
            <div className="space-y-5">
              <Input
                label="Нэр *"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="Таны нэр"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Утас *"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="99XXXXXX"
                  hint="Захиалгаа хянахад ашиглана"
                />
                <Input
                  label="Имэйл"
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="name@example.mn"
                />
              </div>
              <Textarea
                label="Хүргэлт / нэмэлт"
                rows={2}
                value={customer.note}
                onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
              />
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Буцах</Button>
                <Button disabled={!canContact} onClick={() => setStep(3)}>Үргэлжлүүлэх</Button>
              </div>
            </div>
          )}

          {/* Step 3 - confirm */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-display text-lg font-bold">Захиалгаа шалгах</h3>
              <dl className="divide-y divide-border rounded-xl border border-border">
                <ConfirmRow label="Бүтээгдэхүүн" value={productName} />
                <ConfirmRow label="Тодорхойлолт" value={spec} />
                <ConfirmRow label="Файл" value={fileName ?? "Хавсаргаагүй"} />
                <ConfirmRow label="Нэр" value={customer.name} />
                <ConfirmRow label="Утас" value={customer.phone} />
                {customer.email && <ConfirmRow label="Имэйл" value={customer.email} />}
                <ConfirmRow label="Нийт дүн" value={formatMNT(total)} strong />
              </dl>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Буцах</Button>
                <Button onClick={place}>Захиалга баталгаажуулах</Button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-secondary/40 p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" /> Захиалгын дүн
            </div>
            <div className="mt-4 font-display text-lg font-bold">{productName}</div>
            <p className="text-sm text-muted-foreground">{spec}</p>
            <div className="mt-5 border-t border-border pt-5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Нийт</span>
                <span className="font-display text-2xl font-extrabold text-primary">
                  {formatMNT(total)}
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Асуулттай юу?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Бидэнтэй холбогдоорой
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </Section>
  )
}

function ConfirmRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={cx("text-right text-sm", strong && "font-display text-lg font-bold text-primary")}>
        {value}
      </dd>
    </div>
  )
}
