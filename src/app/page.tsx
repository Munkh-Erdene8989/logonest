import Link from "next/link"
import {
  ArrowRight,
  Calculator,
  Clock,
  PackageCheck,
  Palette,
  Truck,
  Zap,
} from "lucide-react"
import { COMPANY, STATS, TESTIMONIALS } from "@/lib/company"
import { getProducts } from "@/lib/data"
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton"
import { ProductCard } from "@/components/shared"
import { ButtonLink, Eyebrow, Section } from "@/components/ui"

const SERVICES = [
  {
    icon: Zap,
    title: "Өргөн формат",
    desc: "Хулдаас, баннер, наалтыг м²-аар, өндөр нягтралтай UV бэхээр.",
  },
  {
    icon: Palette,
    title: "Оффсет хэвлэл",
    desc: "Нэрийн хуудас, брошур, каталогийг тансаг өнгөлгөөтэй.",
  },
  {
    icon: Truck,
    title: "Хүргэлт",
    desc: "Улаанбаатар хотын дотор шуурхай хүргэлтийн үйлчилгээ.",
  },
  {
    icon: PackageCheck,
    title: "Дизайн туслалцаа",
    desc: "Мэргэжлийн дизайнерууд таны макетыг хэвлэлд бэлдэнэ.",
  },
]

const STEPS = [
  { n: "01", t: "Бүтээгдэхүүнээ сонго", d: "Каталогоос сонгож параметрээ тохируул." },
  { n: "02", t: "Үнээ тооцоол", d: "Онлайн тооцоолуураар төсвөө урьдчилан мэд." },
  { n: "03", t: "Захиалга өг", d: "Файлаа хавсаргаж холбоо барих мэдээллээ үлдээ." },
  { n: "04", t: "Явцаа хяна", d: "Захиалгын дугаар/утсаараа бэлэн болохыг хүлээ." },
]

export const dynamic = "force-dynamic"

export default async function LandingPage() {
  const products = await getProducts()
  const featured = products.filter((p) => p.popular).slice(0, 3)

  return (
    <div className="animate-fade-up">
      <Section className="relative pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>Хэвлэлийн газар · {COMPANY.established} оноос</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Санаагаа <span className="text-primary">хэвлэмэл</span> бодит болгоё
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Нэрийн хуудаснаас эхлээд том хэмжээний баннер хүртэл — чанартай хэвлэл,
              ил тод үнэ, шуурхай хугацаа. Нэвтрэхгүйгээр захиалж, явцаа онлайнаар хяна.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/order" size="lg">
                Захиалга өгөх <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/calculator" size="lg" variant="outline">
                <Calculator className="h-4 w-4" /> Үнэ тооцоолох
              </ButtonLink>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Дундаж бэлэн болох хугацаа: <b className="text-foreground">24 цаг</b>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-border bg-muted shadow-2xl shadow-ink/10">
              <ImageWithSkeleton
                src="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=1200&h=1000&fit=crop&auto=format"
                alt="Хэвлэлийн машин ажиллаж байгаа нь"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-border bg-card p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <PackageCheck className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-xl font-bold">42,000+</div>
                  <div className="text-xs text-muted-foreground">гүйцэтгэсэн захиалга</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="mt-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card p-6 text-center">
              <div className="font-display text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="mt-24">
        <div className="max-w-2xl">
          <Eyebrow>Үйлчилгээ</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Бүх төрлийн хэвлэл нэг дороос
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="mt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Онцлох</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Эрэлттэй бүтээгдэхүүн
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            Бүгдийг үзэх <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      <Section className="mt-24">
        <div className="rounded-3xl bg-ink px-6 py-14 text-white sm:px-12">
          <Eyebrow>Хэрхэн ажилладаг вэ</Eyebrow>
          <h2 className="mt-4 max-w-lg font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            4 алхмаар захиалгаа өг
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="font-mono text-3xl font-bold text-primary">{s.n}</div>
                <h3 className="mt-3 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-white/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="mt-24">
        <Eyebrow>Сэтгэгдэл</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Харилцагчид юу гэж хэлдэг вэ
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="font-display text-4xl leading-none text-primary">&ldquo;</div>
              <blockquote className="mt-2 text-foreground/90">{t.body}</blockquote>
              <figcaption className="mt-5">
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section className="mt-24">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-accent/40 px-6 py-16 text-center">
          <h2 className="max-w-xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Төслөө өнөөдөр эхлүүлэх үү?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Онлайнаар үнээ тооцож, хэдхэн минутанд захиалгаа баталгаажуул.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/order" size="lg">Захиалга өгөх</ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline">Зөвлөгөө авах</ButtonLink>
          </div>
        </div>
      </Section>
    </div>
  )
}
