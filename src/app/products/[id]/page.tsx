import Link from "next/link"
import { ArrowLeft, Calculator, Check, ShoppingCart } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProduct, getProducts } from "@/lib/data"
import { formatMNT } from "@/lib/format"
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton"
import { Reveal } from "@/components/motion/Reveal"
import { ProductCard } from "@/components/shared"
import { ButtonLink, Eyebrow, Section } from "@/components/ui"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  return { title: product?.name ?? "Бүтээгдэхүүн" }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const products = await getProducts()
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <Section className="py-14">
      <Reveal from="load">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Каталог
        </Link>
      </Reveal>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Reveal from="load">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
            <ImageWithSkeleton
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>

        <Reveal from="load" delay={0.08}>
          <Eyebrow>{product.category}</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-5">
            <span className="text-sm text-muted-foreground">Эхлэх үнэ</span>
            <div className="font-display text-3xl font-extrabold text-primary">
              {formatMNT(product.basePrice)}
              <span className="text-base font-normal text-muted-foreground"> / {product.unit}</span>
            </div>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Check className="h-3 w-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`/order?product=${product.id}`} size="lg">
              <ShoppingCart className="h-4 w-4" /> Захиалах
            </ButtonLink>
            <ButtonLink href="/calculator" size="lg" variant="outline">
              <Calculator className="h-4 w-4" /> Үнэ тооцоолох
            </ButtonLink>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">Төстэй бүтээгдэхүүн</h2>
          </Reveal>
          <Reveal stagger={0.07} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Reveal>
        </div>
      )}
    </Section>
  )
}
