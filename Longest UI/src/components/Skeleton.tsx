import { cx } from "./ui"

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("skeleton rounded-lg", className)} />
}

// Бүтээгдэхүүний картны skeleton bone
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Хүснэгтийн мөрийн skeleton (админ)
export function RowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-4 py-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  )
}

export function BlockSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}
