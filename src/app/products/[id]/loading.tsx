import { ProductCardSkeleton, ProductDetailSkeleton, Skeleton } from "@/components/Skeleton"
import { Section } from "@/components/ui"

export default function ProductDetailLoading() {
  return (
    <Section className="py-14">
      <Skeleton className="h-4 w-24" />
      <div className="mt-6">
        <ProductDetailSkeleton />
      </div>
      <div className="mt-20">
        <Skeleton className="h-8 w-56" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Section>
  )
}
