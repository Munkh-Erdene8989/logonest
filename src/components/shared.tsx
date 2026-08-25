import Link from "next/link"
import { Check } from "lucide-react"
import type { Order, OrderStatus, Product } from "@/lib/types"
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/types"
import { formatDate, formatMNT } from "@/lib/format"
import { ImageWithSkeleton } from "./ImageWithSkeleton"
import { Badge, cx } from "./ui"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-ink/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ImageWithSkeleton
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.popular && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Эрэлттэй
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {product.category}
        </span>
        <h3 className="mt-1 font-display text-lg font-bold">{product.name}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{product.tagline}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">эхлэх үнэ</span>
            <div className="font-display font-bold">
              {formatMNT(product.basePrice)}
              <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
            </div>
          </div>
          <span className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors group-hover:border-primary group-hover:text-primary">
            Үзэх
          </span>
        </div>
      </div>
    </Link>
  )
}

const statusStyle: Record<OrderStatus, string> = {
  received: "bg-secondary text-secondary-foreground",
  design: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  printing: "bg-accent text-accent-foreground",
  ready: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge className={statusStyle[status]}>{STATUS_LABEL[status]}</Badge>
}

export function OrderTimeline({ order }: { order: Order }) {
  const currentIndex = STATUS_ORDER.indexOf(order.status)
  return (
    <ol className="relative space-y-6 pl-2">
      {STATUS_ORDER.map((status, i) => {
        const done = i <= currentIndex
        const active = i === currentIndex
        const event = order.timeline.find((e) => e.status === status)
        return (
          <li key={status} className="relative flex gap-4">
            {i < STATUS_ORDER.length - 1 && (
              <span
                className={cx(
                  "absolute left-[13px] top-7 h-[calc(100%+0.5rem)] w-0.5",
                  done && i < currentIndex ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cx(
                "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors",
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
                active && "ring-4 ring-primary/15",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-muted-foreground" />}
            </span>
            <div className="pb-1">
              <p className={cx("font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                {STATUS_LABEL[status]}
              </p>
              {event && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {formatDate(event.at)}
                  {event.note ? ` · ${event.note}` : ""}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
