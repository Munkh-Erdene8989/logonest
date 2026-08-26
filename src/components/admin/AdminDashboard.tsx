"use client"

import { useEffect, useMemo, useState } from "react"
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
  ImagePlus,
  LayoutDashboard,
  Loader2,
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
import { ImageCropModal } from "@/components/admin/ImageCropModal"
import { CountUp } from "@/components/motion/CountUp"
import { StatusBadge } from "@/components/shared"
import { Button, Input, Textarea, cx } from "@/components/ui"
import { AnimatePresence, motion } from "motion/react"

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
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:gap-6 sm:px-8 sm:py-8 lg:flex-row">
      <aside className="lg:w-60 lg:shrink-0">
        <div className="lg:sticky lg:top-4">
          <div className="mb-3 flex items-center justify-between gap-3 lg:mb-4 lg:block">
            <div>
              <div className="font-display text-lg font-extrabold">Админ самбар</div>
              <div className="text-xs text-muted-foreground">LOGONEST ХХК</div>
            </div>
            <button
              onClick={logout}
              className="flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-secondary lg:hidden"
            >
              <LogOut className="h-4 w-4" /> Гарах
            </button>
          </div>
          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0 [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  "flex h-11 shrink-0 items-center gap-2.5 rounded-xl px-4 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
                  tab === t.id
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-foreground/70 hover:bg-secondary",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.id === "messages" && unread > 0 && (
                  <span
                    className={cx(
                      "ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs",
                      tab === t.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    {unread}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <button
            onClick={logout}
            className="mt-4 hidden h-11 items-center gap-2.5 rounded-xl px-4 text-sm font-medium text-muted-foreground hover:bg-secondary lg:flex"
          >
            <LogOut className="h-4 w-4" /> Гарах
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "overview" && <Overview orders={orders} products={products} messages={messages} />}
            {tab === "orders" && <Orders orders={orders} />}
            {tab === "products" && <ProductsAdmin products={products} />}
            {tab === "pricing" && <PricingAdmin pricing={pricing} />}
            {tab === "messages" && <Messages messages={messages} />}
            {tab === "news" && <NewsAdmin news={news} />}
          </motion.div>
        </AnimatePresence>
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
        <Stat icon={ClipboardList} label="Нийт захиалга" to={orders.length} />
        <Stat icon={TrendingUp} label="Идэвхтэй" to={active} />
        <Stat icon={Package} label="Бүтээгдэхүүн" to={products.length} />
        <Stat icon={Mail} label="Нийт орлого" to={revenue} format={formatMNT} />
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
  image: "",
  basePrice: 0,
  unit: "ш",
  features: [],
}

function ProductsAdmin({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<Product | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function startEdit(product: Product) {
    setEditing({ ...product })
    setFile(null)
    setError("")
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  function onFileChange(next: File | null) {
    if (!next) return
    if (!next.type.startsWith("image/")) {
      setError("Зөвшөөрөгдсөн формат: JPG, PNG, WebP.")
      return
    }
    setError("")
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(URL.createObjectURL(next))
  }

  function closeCrop() {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  async function save() {
    if (!editing) return
    if (!editing.name.trim()) return
    if (!file && !editing.image.trim()) {
      setError("Зураг оруулах эсвэл URL бичнэ үү.")
      return
    }
    setSaving(true)
    setError("")
    try {
      const fd = new FormData()
      fd.set("product", JSON.stringify(editing))
      if (file) fd.set("image", file)
      const result = await saveProductAction(fd)
      if (result && !result.ok) {
        setError(result.error)
        return
      }
      setEditing(null)
      setFile(null)
      router.refresh()
    } catch {
      setError("Хадгалахад алдаа гарлаа.")
    } finally {
      setSaving(false)
    }
  }

  const previewSrc = preview || editing?.image || ""

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <SectionTitle title="Бүтээгдэхүүн" subtitle="Нэмэх, засах, устгах" />
        <Button size="sm" className="shrink-0" onClick={() => startEdit({ ...EMPTY_PRODUCT })}>
          <Plus className="h-4 w-4" /> Нэмэх
        </Button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-primary/40 bg-accent/20 p-4 sm:p-6">
          <h3 className="font-display font-bold">{editing.id ? "Засах" : "Шинэ бүтээгдэхүүн"}</h3>

          <label
            className={cx(
              "mt-4 flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed py-8 text-center transition-colors duration-200 motion-reduce:transition-none",
              dragOver ? "border-primary bg-accent/40" : "border-border hover:border-primary hover:bg-accent/20",
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              onFileChange(e.dataTransfer.files[0] ?? null)
            }}
          >
            {previewSrc ? (
              <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-xl bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <ImagePlus className="h-8 w-8 text-primary" />
            )}
            <div>
              <p className="font-medium">{previewSrc ? "Зураг солих" : "Зураг оруулах"}</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, WebP · 4:3 таслах · товшиж сонгоно уу</p>
            </div>
            {file && (
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                {file.name}
              </span>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
              onChange={(e) => {
                onFileChange(e.target.files?.[0] ?? null)
                e.target.value = ""
              }}
            />
          </label>

          <div className="mt-4">
            <Input
              label="Эсвэл зургийн URL"
              value={editing.image}
              onChange={(e) => setEditing({ ...editing, image: e.target.value })}
              placeholder="https://…"
              hint="Файл оруулаагүй бол URL ашиглана"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Нэр" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <Input label="Ангилал" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            <div className="sm:col-span-2">
              <Input
                label="Богино тайлбар"
                value={editing.tagline}
                onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
              />
            </div>
            <Input label="Үнэ (₮)" type="number" value={editing.basePrice} onChange={(e) => setEditing({ ...editing, basePrice: Number(e.target.value) })} />
            <Input label="Нэгж" value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
          </div>
          <Textarea
            label="Дэлгэрэнгүй"
            className="mt-4"
            rows={3}
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
          />
          {error && <p className="mt-3 text-sm text-primary">{error}</p>}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" onClick={save} disabled={!editing.name} loading={saving}>
              Хадгалах
            </Button>
            <Button
              className="w-full sm:w-auto"
              variant="ghost"
              disabled={saving}
              onClick={() => {
                closeCrop()
                setEditing(null)
                setFile(null)
                setError("")
              }}
            >
              Болих
            </Button>
          </div>
        </div>
      )}

      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onCancel={closeCrop}
          onConfirm={(cropped) => {
            closeCrop()
            setFile(cropped)
          }}
        />
      )}

      <div className="grid gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {p.image ? (
                  <ImageWithSkeleton
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-muted-foreground">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display font-bold">{p.name}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {p.category} · {formatMNT(p.basePrice)}/{p.unit}
                </div>
              </div>
            </div>
            <div className="flex gap-2 sm:shrink-0">
              <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => startEdit(p)}>
                Засах
              </Button>
              <button
                onClick={async () => {
                  setDeletingId(p.id)
                  try {
                    await deleteProductAction(p.id)
                    router.refresh()
                  } finally {
                    setDeletingId(null)
                  }
                }}
                disabled={deletingId === p.id}
                className="grid h-11 w-11 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
                aria-label="Устгах"
              >
                {deletingId === p.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PricingAdmin({ pricing }: { pricing: PricingType[] }) {
  const [draft, setDraft] = useState<PricingType[]>(pricing)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

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
          loading={saving}
          onClick={async () => {
            setSaving(true)
            try {
              await updatePricingAction(draft)
              setSaved(true)
              setTimeout(() => setSaved(false), 1500)
            } finally {
              setSaving(false)
            }
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
  to,
  format,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  to: number
  format?: (n: number) => string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div className="mt-3 font-display text-2xl font-extrabold">
        <CountUp to={to} format={format} />
      </div>
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
