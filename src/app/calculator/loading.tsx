import { BlockSkeleton } from "@/components/Skeleton"
import { Section } from "@/components/ui"

export default function CalculatorLoading() {
  return (
    <Section className="py-14">
      <BlockSkeleton />
    </Section>
  )
}
