import { Suspense } from "react"
import type { Metadata } from "next"
import { TrackForm } from "@/components/TrackForm"
import { BlockSkeleton } from "@/components/Skeleton"
import { Section } from "@/components/ui"

export const metadata: Metadata = { title: "Захиалга хянах" }

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <Section className="py-14">
          <BlockSkeleton />
        </Section>
      }
    >
      <TrackForm />
    </Suspense>
  )
}
