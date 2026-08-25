"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Mail,
  Newspaper,
  Package,
  Plus,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
} from "lucide-react"
import {
  deleteNewsAction,
  deleteProductAction,
  markMessageReadAction,
  saveNewsAction,
  saveProductAction,
  updateOrderStatusAction,
  updatePricingAction,
} from "@/lib/actions/admin"
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/types"
import type { Message, NewsItem, Order, OrderStatus, PricingType, Product } from "@/lib/types"
import { formatDate, formatMNT } from "@/lib/format"
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton"
import { StatusBadge } from "@/components/shared"
import { Button, Input, Textarea, cx } from "@/components/ui"

type Tab = "overview" | "orders" | "products" | "pricing" | "messages" | "news"

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Тойм", icon: LayoutDashboard },
  { id: "orders", label: "Захиалга", icon: ClipboardList },
  { id: "products", label: "Бүтээгдэхүүн", icon: Package },
  { id: "pricing", label: "Үнэ тохиргоо", icon: SlidersHorizontal },
  { id: "messages", label: "Зурвас", icon: Mail },
  { id: "news", label: "Мэдээ", icon: Newspaper },
]

export function AdminDashboard({
  orders,
  products,
  pricing,
  messages,
  news,
}: {
  orders: Order[]
  products: Product[]
  pricing: PricingType[]
  messages: Message[]
  news: NewsItem[]
}) {
  const [tab, setTab] = useState<Tab>("overview")
  const router = useRouter()
  const unread = messages.filter((m) => !m.read).length

  async function logout() {
    await fetch("/api/auth/session", { method: "DELETE" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8 lg:flex-row">
      <aside className="lg:w-60 lg:shrink-0">
        <div className="lg:sticky lg:top-24">
          <div className="mb-4 hidden lg:block">
            <div className="font-display text-lg font-extrabold">Админ самбар</div>
            <div className="text-xs text-muted-foreground">LOGONEST ХХК</div>
          </div>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-secondary",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.id === "messages" && unread > 0 && (
                  <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-4 hidden items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary lg:flex"
          >
            <LogOut className="h-4 w-4" /> Гарах
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {tab === "overview" && <Overview orders={orders} products={products} messages={messages} />}
        {tab === "orders" && <Orders orders={orders} />}
        {tab === "products" && <ProductsAdmin products={products} />}
        {tab === "pricing" && <PricingAdmin pricing={pricing} />}
        {tab === "messages" && <Messages messages={messages} />}
        {tab === "news" && <NewsAdmin news={news} />}
      </main>
    </div>
  )
}

function Overview({
  orders,
  products,
  messages,
}: {
  orders: Order[]
  products: Product[]
  messages: Message[]
}) {
  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const active = orders.filter((o) => o.status !== "delivered").length

  const statusData = STATUS_ORDER.map((s) => ({
    name: STATUS_LABEL[s],
    value: orders.filter((o) => o.status === s).length,
  })).filter((d) => d.value > 0)

  const COLORS = ["#08cb00", "#067a00", "#fbbf24", "#22d47f", "#60a5fa"]

  const revenueByProduct = useMemo(() => {
    const map = new Map<string, number>()
    orders.forEach((o) => map.set(o.productName, (map.get(o.productName) ?? 0) + o.total))
    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [orders])

  return (
    <div className="space-y-8">
      <SectionTitle title="Тойм" subtitle="Захиалга, орлогын ерөнхий үзүүлэлт" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={ClipboardList} label="Нийт захиалга" value={String(orders.length)} />
        <Stat icon={TrendingUp} label="Идэвхтэй" value={String(active)} />
        <Stat icon={Package} label="Бүтээгдэхүүн" value={String(products.length)} />
        <Stat icon={Mail} label="Нийт орлого" value={formatMNT(revenue)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Захиалгын статус">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3">
            {statusData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </Card>

        <Card title="Бүтээгдэхүүнээр орлого">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueByProduct} margin={{ left: -10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v) => formatMNT(Number(v))} />
              <Bar dataKey="value" fill="#08cb00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Сүүлийн захиалга">
        <div className="space-y-2">
          {orders.slice(0, 5).map((o) => (
            <div key={o.code} className="flex items-center justify-between border-b border-border py-2.5 text-sm last:border-0">
              <span className="font-mono font-medium text-primary">{o.code}</span>
              <span className="hidden flex-1 px-4 text-muted-foreground sm:block">{o.productName}</span>
              <span className="mr-4 font-medium">{formatMNT(o.total)}</span>
              <StatusBadge status={o.status} />
            </div>
          ))}
          {messages.length > 0 && (
            <p className="pt-3 text-xs text-muted-foreground">{messages.length} зурвас байна.</p>
          )}
        </div>
      </Card>
    </div>
  )
}

function Orders({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all")
  const router = useRouter()
  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="space-y-6">
      <SectionTitle title="Захиалгын удирдлага" subtitle="Статус солих, дэлгэрэнгүй харах" />

      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUS_ORDER] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cx(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === s ? "bg-primary text-primary-foreground" : "border border-border hover:border-primary",
            )}
          >
            {s === "all" ? "Бүгд" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.map((o) => (
          <div key={o.code} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">{o.code}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="mt-1.5 font-display font-bold">{o.productName}</div>
                <div className="text-sm text-muted-foreground">{o.spec}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {o.customer.name} · {o.customer.phone}
                  {o.customer.email ? ` · ${o.customer.email}` : ""}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{formatDate(o.createdAt)}</div>
                {o.fileName && (
                  <div className="mt-1 text-xs text-muted-foreground">Файл: {o.fileName}</div>
                )}
              </div>
              <div className="text-right">
                <div className="font-display text-xl font-extrabold">{formatMNT(o.total)}</div>
                <div className="mt-3">
                  <label className="text-xs text-muted-foreground">Статус солих</label>
                  <select
                    value={o.status}
                    onChange={async (e) => {
                      await updateOrderStatusAction(o.code, e.target.value as OrderStatus)
                      router.refresh()
                    }}
                    className="mt-1 block rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">Захиалга алга.</p>
        )}
      </div>
    </div>
  )
}

const EMPTY_PRODUCT: Product = {
  id: "",
  name: "",
  category: "Оффсет хэвлэл",
  tagline: "",
  description: "",
  image: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=900&h=650&fit=crop&auto=format",
  basePrice: 0,
  unit: "ш",
  features: [],
}

function ProductsAdmin({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | null>(null)
  const router = useRouter()

  async function save() {
    if (!editing) return
    await saveProductAction(editing)
    setEditing(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="Бүтээгдэхүүн" subtitle="Нэмэх, засах, устгах" />
        <Button size="sm" onClick={() => setEditing({ ...EMPTY_PRODUCT })}>
          <Plus className="h-4 w-4" /> Нэмэх
        </Button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-primary/40 bg-accent/20 p-6">
          <h3 className="font-display font-bold">{editing.id ? "Засах" : "Шинэ бүтээгдэхүүн"}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Нэр" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <Input label="Ангилал" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            <Input label="Богино тайлбар" value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
            <Input label="Зургийн URL" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
            <Input label="Үнэ (₮)" type="number" value={editing.basePrice} onChange={(e) => setEditing({ ...editing, basePrice: Number(e.target.value) })} />
            <Input label="Нэгж" value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
          </div>
          <Textarea
            label="Дэлгэрэнгүй"
            className="mt-4"
            rows={2}
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
          />
          <div className="mt-4 flex gap-3">
            <Button onClick={save} disabled={!editing.name}>Хадгалах</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Болих</Button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <ImageWithSkeleton
                src={p.image}
                alt={p.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display font-bold">{p.name}</div>
              <div className="truncate text-sm text-muted-foreground">{p.category} · {formatMNT(p.basePrice)}/{p.unit}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setEditing(p)}>Засах</Button>
            <button
              onClick={async () => {
                await deleteProductAction(p.id)
                router.refresh()
              }}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
              aria-label="Устгах"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PricingAdmin({ pricing }: { pricing: PricingType[] }) {
  const [draft, setDraft] = useState<PricingType[]>(pricing)
  const [saved, setSaved] = useState(false)

  function setMaterialPrice(typeId: string, matId: string, price: number) {
    setDraft((prev) =>
      prev.map((t) =>
        t.id === typeId
          ? { ...t, materials: t.materials?.map((m) => (m.id === matId ? { ...m, pricePerM2: price } : m)) }
          : t,
      ),
    )
  }
  function setUnitPrice(typeId: string, price: number) {
    setDraft((prev) => prev.map((t) => (t.id === typeId ? { ...t, basePricePerUnit: price } : t)))
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Тооцоолуурын үнэ" subtitle="Материал, нэгжийн суурь үнийг тохируулах" />

      {draft.map((t) => (
        <div key={t.id} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display font-bold">{t.name}</h3>
          <p className="text-sm text-muted-foreground">{t.description}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {t.mode === "area" &&
              t.materials?.map((m) => (
                <Input
                  key={m.id}
                  label={`${m.name} (₮/м²)`}
                  type="number"
                  value={m.pricePerM2}
                  onChange={(e) => setMaterialPrice(t.id, m.id, Number(e.target.value))}
                />
              ))}
            {t.mode === "unit" && (
              <Input
                label="Суурь үнэ (₮/ш)"
                type="number"
                value={t.basePricePerUnit ?? 0}
                onChange={(e) => setUnitPrice(t.id, Number(e.target.value))}
              />
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <Button
          onClick={async () => {
            await updatePricingAction(draft)
            setSaved(true)
            setTimeout(() => setSaved(false), 1500)
          }}
        >
          Хадгалах
        </Button>
        {saved && <span className="text-sm text-primary">Хадгалагдлаа ✓</span>}
      </div>
    </div>
  )
}

function Messages({ messages }: { messages: Message[] }) {
  const router = useRouter()
  return (
    <div className="space-y-6">
      <SectionTitle title="Ирсэн зурвас" subtitle="Холбоо барих хэсгээс ирсэн хүсэлтүүд" />
      {messages.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">Одоогоор зурвас алга.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cx(
                "rounded-2xl border p-5",
                m.read ? "border-border bg-card" : "border-primary/40 bg-accent/20",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">
                    {m.name}
                    {!m.read && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Шинэ</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {m.phone}
                    {m.email ? ` · ${m.email}` : ""}
                  </div>
                </div>
                <time className="font-mono text-xs text-muted-foreground">{formatDate(m.createdAt)}</time>
              </div>
              <p className="mt-3 text-sm">{m.body}</p>
              {!m.read && (
                <button
                  onClick={async () => {
                    await markMessageReadAction(m.id)
                    router.refresh()
                  }}
                  className="mt-3 text-sm font-medium text-primary hover:underline"
                >
                  Уншсан гэж тэмдэглэх
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const EMPTY_NEWS: NewsItem = { id: "", title: "", date: new Date().toISOString().slice(0, 10), excerpt: "", tag: "Мэдээ" }

function NewsAdmin({ news }: { news: NewsItem[] }) {
  const [editing, setEditing] = useState<NewsItem | null>(null)
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="Мэдээ" subtitle="Нийтлэл нэмэх, засах, устгах" />
        <Button size="sm" onClick={() => setEditing({ ...EMPTY_NEWS })}>
          <Plus className="h-4 w-4" /> Нэмэх
        </Button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-primary/40 bg-accent/20 p-6 space-y-4">
          <Input label="Гарчиг" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Огноо" type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
            <Input label="Ангилал" value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} />
          </div>
          <Textarea label="Товч" rows={3} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
          <div className="flex gap-3">
            <Button
              disabled={!editing.title}
              onClick={async () => {
                await saveNewsAction(editing)
                setEditing(null)
                router.refresh()
              }}
            >
              Хадгалах
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Болих</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {news.map((n) => (
          <div key={n.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="min-w-0 flex-1">
              <div className="font-display font-bold">{n.title}</div>
              <div className="text-sm text-muted-foreground">{n.tag} · {n.date}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setEditing(n)}>Засах</Button>
            <button
              onClick={async () => {
                await deleteNewsAction(n.id)
                router.refresh()
              }}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
              aria-label="Устгах"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div className="mt-3 font-display text-2xl font-extrabold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-4 font-display font-bold">{title}</h3>
      {children}
    </div>
  )
}
