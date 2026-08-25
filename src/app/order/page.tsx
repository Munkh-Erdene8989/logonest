import { Suspense } from "react"
import type { Metadata } from "next"
import { getPricing, getProducts } from "@/lib/data"
import { OrderForm } from "@/components/OrderForm"
import { BlockSkeleton } from "@/components/Skeleton"
import { Section } from "@/components/ui"

export const metadata: Metadata = { title: "Захиалга өгөх" }
export const dynamic = "force-dynamic"

export default async function OrderPage() {
  const [products, pricing] = await Promise.all([getProducts(), getPricing()])
  return (
    <Suspense
      fallback={
        <Section className="py-14">
          <BlockSkeleton />
        </Section>
      }
    >
      <OrderForm products={products} pricing={pricing} />
    </Suspense>
  )
}
