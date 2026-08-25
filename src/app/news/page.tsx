import type { Metadata } from "next"
import { getNews } from "@/lib/data"
import { Badge, Eyebrow, Section } from "@/components/ui"

export const metadata: Metadata = { title: "Мэдээ" }
export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const news = await getNews()

  return (
    <Section className="py-14 animate-fade-up">
      <Eyebrow>Мэдээ</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        Мэдээ, урамшуулал, зөвлөгөө
      </h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Шинэ технологи, урамшуулал болон хэвлэлд зориулсан хэрэгтэй зөвлөмжүүд.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {news.map((n) => (
          <article
            key={n.id}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <Badge className="bg-accent text-accent-foreground">{n.tag}</Badge>
              <time className="font-mono text-xs text-muted-foreground">{n.date}</time>
            </div>
            <h2 className="mt-4 font-display text-lg font-bold group-hover:text-primary">
              {n.title}
            </h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.excerpt}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
