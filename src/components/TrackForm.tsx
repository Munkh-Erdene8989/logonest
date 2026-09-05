"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { PackageSearch, SearchX } from "lucide-react"
import { trackOrdersAction } from "@/lib/actions/public"
import { QPayCheckout } from "@/components/QPayCheckout"
import { formatDate, formatMNT } from "@/lib/format"
import type { Order } from "@/lib/types"
import { Reveal } from "@/components/motion/Reveal"
import { OrderTimeline, PaymentBadge, StatusBadge } from "@/components/shared"
import { Button, Eyebrow, Section } from "@/components/ui"

export function TrackForm() {
  const params = useSearchParams()
  const [q, setQ] = useState(params.get("code") ?? "")
  const [result, setResult] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(false)

  async function search(query: string) {
    const term = query.trim()
    if (!term) {
      setResult(null)
      return
    }
    setLoading(true)
    try {
      const found = await trackOrdersAction(term)
      setResult(found)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const code = params.get("code")
    if (code) search(code)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Section className="py-14">
      <div className="mx-auto max-w-2xl">
        <Reveal from="load">
          <Eyebrow>Захиалга хянах</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
            Захиалгын явц шалгах
          </h1>
          <p className="mt-3 text-muted-foreground">
            Захиалгын дугаар, эсвэл захиалахдаа өгсөн утас/имэйлээ оруулаад хайна уу. Нэвтрэх
            шаардлагагүй.
          </p>
        </Reveal>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            search(q)
          }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <PackageSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="LN-XXXXXX / 99XXXXXX / имэйл"
              className="h-12 w-full rounded-full border border-border bg-card pl-12 pr-4 font-mono focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Хайж байна..." : "Хайх"}
          </Button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Туршилтын дугаар: <span className="font-mono">LN-8QK2P1</span> эсвэл утас{" "}
          <span className="font-mono">99112233</span>
        </p>

        <div className="mt-10 space-y-6">
          <AnimatePresence>
            {result && result.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-dashed border-border py-14 text-center"
              >
                <SearchX className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium">Захиалга олдсонгүй</p>
                <p className="text-sm text-muted-foreground">
                  Дугаар эсвэл холбоо барих мэдээллээ шалгана уу.
                </p>
              </motion.div>
            )}
            {result?.map((o) => (
              <motion.div
                key={o.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-sm font-bold text-primary">{o.code}</div>
                    <h2 className="mt-1 font-display text-xl font-bold">{o.productName}</h2>
                    <p className="text-sm text-muted-foreground">{o.spec}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {o.payment && <PaymentBadge status={o.payment.status} />}
                    <StatusBadge status={o.status} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>{formatDate(o.createdAt)}</span>
                  <span>{formatMNT(o.total)}</span>
                  {o.fileName && <span>Файл: {o.fileName}</span>}
                </div>
                {o.payment && o.payment.status !== "paid" && (
                  <div className="mt-5">
                    <QPayCheckout code={o.code} total={o.total} initial={o.payment} />
                  </div>
                )}
                <div className="mt-6">
                  <OrderTimeline order={o} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
