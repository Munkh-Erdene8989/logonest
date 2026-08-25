import { ProductCardSkeleton } from "@/components/Skeleton"
import { Section } from "@/components/ui"

export default function ProductsLoading() {
  return (
    <Section className="py-14">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </Section>
  )
}
