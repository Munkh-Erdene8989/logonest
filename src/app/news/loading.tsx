import { NewsCardSkeleton, Skeleton } from "@/components/Skeleton"
import { Section } from "@/components/ui"

export default function NewsLoading() {
  return (
    <Section className="py-14">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-4 h-10 w-80" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </Section>
  )
}
