import { NEWS } from "../data/demo"
import { useFakeLoading } from "../lib/useLoading"
import { Skeleton } from "../components/Skeleton"
import { Badge, Eyebrow, Section } from "../components/ui"

export default function News() {
  const loading = useFakeLoading(500)

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
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))
          : NEWS.map((n) => (
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
                <span className="mt-4 text-sm font-medium text-primary">Дэлгэрэнгүй →</span>
              </article>
            ))}
      </div>
    </Section>
  )
}
