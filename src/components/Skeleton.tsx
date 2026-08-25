import { Loader2 } from "lucide-react"
import { cx } from "./ui"

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("skeleton rounded-lg", className)} />
}

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

export function NewsCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="mt-4 h-5 w-4/5" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-2/3" />
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-12 w-40" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-full sm:h-16" />
        <Skeleton className="h-12 w-4/5 sm:h-16" />
        <Skeleton className="h-16 w-full max-w-lg" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
      </div>
      <Skeleton className="aspect-[5/4] w-full rounded-3xl" />
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

export function AdminSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-4 flex items-center gap-2.5 text-sm text-muted-foreground sm:mb-6">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
        Самбарыг уншиж байна…
      </div>
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row">
        <aside className="hidden space-y-2 lg:block lg:w-60 lg:shrink-0">
          <Skeleton className="mb-4 h-6 w-32" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-xl" />
          ))}
        </aside>
        <div className="-mx-4 flex gap-2 overflow-hidden px-4 lg:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-24 shrink-0 rounded-xl" />
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
