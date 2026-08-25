import { HeroSkeleton, ProductCardSkeleton, Skeleton } from "@/components/Skeleton"
import { Section } from "@/components/ui"

export default function HomeLoading() {
  return (
    <div>
      <Section className="relative pt-16 sm:pt-24">
        <HeroSkeleton />
      </Section>
      <Section className="mt-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card p-6">
              <Skeleton className="mx-auto h-8 w-20" />
              <Skeleton className="mx-auto mt-2 h-4 w-28" />
            </div>
          ))}
        </div>
      </Section>
      <Section className="mt-24">
        <Skeleton className="h-8 w-64" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </Section>
    </div>
  )
}
