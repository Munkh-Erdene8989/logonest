import { useState } from "react"
import { CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react"
import { COMPANY, FAQS } from "../data/demo"
import { useStore } from "../lib/store"
import { Button, Eyebrow, Input, Section, Textarea, cx } from "../components/ui"

export default function Contact() {
  const { addMessage } = useStore()
  const [form, setForm] = useState({ name: "", phone: "", email: "", body: "" })
  const [sent, setSent] = useState(false)
  const [open, setOpen] = useState(0)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    addMessage({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...form,
      read: false,
    })
    setSent(true)
    setForm({ name: "", phone: "", email: "", body: "" })
  }

  return (
    <Section className="py-14 animate-fade-up">
      <Eyebrow>Холбоо барих</Eyebrow>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        Бидэнтэй холбогдоорой
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Info + form */}
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard icon={Phone} label="Утас" value={COMPANY.phone} />
            <InfoCard icon={Mail} label="Имэйл" value={COMPANY.email} />
            <InfoCard icon={MapPin} label="Хаяг" value={COMPANY.address} />
            <InfoCard icon={Clock} label="Цагийн хуваарь" value={COMPANY.hours} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Байршил"
              className="h-56 w-full"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=106.88%2C47.90%2C106.94%2C47.93&layer=mapnik"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <h3 className="mt-4 font-display text-xl font-bold">Илгээгдлээ!</h3>
              <p className="mt-2 text-muted-foreground">Бид тун удахгүй тантай холбогдоно.</p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                Дахин илгээх
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h3 className="font-display text-lg font-bold">Хүсэлт илгээх</h3>
              <Input
                label="Нэр"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Утас"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Input
                  label="Имэйл"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <Textarea
                label="Зурвас"
                required
                rows={4}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
              <Button type="submit" className="w-full" size="lg">
                Илгээх
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <h2 className="font-display text-2xl font-extrabold">Түгээмэл асуулт</h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
          {FAQS.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
              >
                {f.q}
                <span
                  className={cx(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-lg transition-transform",
                    open === i && "rotate-45 border-primary text-primary",
                  )}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function InfoCard({
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
      <div className="mt-3 text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  )
}
