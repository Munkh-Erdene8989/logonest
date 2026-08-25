import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { PackageSearch, SearchX } from "lucide-react"
import { useStore } from "../lib/store"
import { formatDate, formatMNT } from "../lib/format"
import type { Order } from "../lib/types"
import { OrderTimeline, StatusBadge } from "../components/shared"
import { Button, Eyebrow, Section } from "../components/ui"

export default function TrackPage() {
  const { orders } = useStore()
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get("code") ?? "")
  const [result, setResult] = useState<Order[] | null>(null)

  function search(query: string) {
    const term = query.trim().toLowerCase()
    if (!term) {
      setResult(null)
      return
    }
    const found = orders.filter(
      (o) =>
        o.code.toLowerCase() === term ||
        o.customer.phone.toLowerCase() === term ||
        o.customer.email.toLowerCase() === term,
    )
    setResult(found)
  }

  // Тооцоолуур/захиалгаас дугаар дамжуулж ирвэл автоматаар хайх
  useEffect(() => {
    if (params.get("code")) search(params.get("code")!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Section className="py-14 animate-fade-up">
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Захиалга хянах</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
          Захиалгын явц шалгах
        </h1>
        <p className="mt-3 text-muted-foreground">
          Захиалгын дугаар, эсвэл захиалахдаа өгсөн утас/имэйлээ оруулаад хайна уу. Нэвтрэх
          шаардлагагүй.
        </p>

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
          <Button type="submit" size="lg">Хайх</Button>
        </form>

        <p className="mt-3 text-xs text-muted-foreground">
          Туршилтын дугаар: <span className="font-mono">LN-8QK2P1</span> эсвэл утас{" "}
          <span className="font-mono">99112233</span>
        </p>

        <div className="mt-10 space-y-6">
          {result && result.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-14 text-center">
              <SearchX className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-medium">Захиалга олдсонгүй</p>
              <p className="text-sm text-muted-foreground">
                Дугаар эсвэл холбоо барих мэдээллээ шалгана уу.
              </p>
            </div>
          )}

          {result?.map((order) => (
            <div key={order.code} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-lg font-bold text-primary">{order.code}</div>
                  <div className="mt-1 font-display font-bold">{order.productName}</div>
                  <div className="text-sm text-muted-foreground">{order.spec}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-4 text-sm sm:grid-cols-3">
                <Meta label="Захиалсан" value={formatDate(order.createdAt)} />
                <Meta label="Тоо ширхэг" value={`${order.quantity} ш`} />
                <Meta label="Нийт дүн" value={formatMNT(order.total)} />
              </div>

              <div className="mt-6">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Захиалгын явц
                </h4>
                <OrderTimeline order={order} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  )
}
