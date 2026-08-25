import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useStore } from "../lib/store"
import { useFakeLoading } from "../lib/useLoading"
import { ProductCard } from "../components/shared"
import { ProductCardSkeleton } from "../components/Skeleton"
import { Eyebrow, Section, cx } from "../components/ui"

export default function Products() {
  const { products } = useStore()
  const loading = useFakeLoading(600)
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState("Бүгд")

  const categories = useMemo(
    () => ["Бүгд", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  )

  const filtered = products.filter((p) => {
    const matchCat = cat === "Бүгд" || p.category === cat
    const matchQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tagline.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  })

  return (
    <Section className="py-14 animate-fade-up">
      <Eyebrow>Каталог</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        Бүтээгдэхүүн, үйлчилгээ
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Хэвлэлийн бүх төрлийн бүтээгдэхүүнээс сонгож, дэлгэрэнгүй үнэ, параметрийг үзээрэй.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Хайх..."
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cx(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                cat === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground/70 hover:border-primary hover:text-primary",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
        ) : filtered.length > 0 ? (
          filtered.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="col-span-full py-16 text-center text-muted-foreground">
            Илэрц олдсонгүй.
          </p>
        )}
      </div>
    </Section>
  )
}
