import type { Metadata } from "next"
import { getProducts } from "@/lib/data"
import { ProductsGrid } from "@/components/ProductsGrid"

export const metadata: Metadata = { title: "Бүтээгдэхүүн" }
export const dynamic = "force-dynamic"

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsGrid products={products} />
}
