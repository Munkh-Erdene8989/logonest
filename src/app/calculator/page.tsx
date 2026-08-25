import type { Metadata } from "next"
import { getPricing } from "@/lib/data"
import { CalculatorForm } from "@/components/CalculatorForm"

export const metadata: Metadata = { title: "Үнэ тооцоолуур" }
export const dynamic = "force-dynamic"

export default async function CalculatorPage() {
  const pricing = await getPricing()
  return <CalculatorForm pricing={pricing} />
}
