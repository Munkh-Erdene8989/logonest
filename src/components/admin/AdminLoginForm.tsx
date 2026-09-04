"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase/client"
import { Logo } from "@/components/Logo"
import { Reveal } from "@/components/motion/Reveal"
import { Button, Input } from "@/components/ui"

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
      const idToken = await cred.user.getIdToken()
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      })
      if (!res.ok) throw new Error("session")
      router.replace("/admin")
      router.refresh()
    } catch (e) {
      const code = typeof e === "object" && e && "code" in e ? String((e as { code: string }).code) : ""
      if (code === "auth/unauthorized-domain") {
        setErr("Энэ домэйнд нэвтрэлт зөвшөөрөгдөөгүй байна.")
      } else if (code === "auth/too-many-requests") {
        setErr("Хэт олон оролдлого. Түр хүлээгээд дахин оролдоно уу.")
      } else if (code === "auth/network-request-failed") {
        setErr("Сүлжээний алдаа. Интернэтээ шалгаад дахин оролдоно уу.")
      } else if (e instanceof Error && e.message === "session") {
        setErr("Нэвтрэлт амжилттай боловч сесс үүсгэж чадсангүй. Дахин оролдоно уу.")
      } else {
        setErr("Имэйл эсвэл нууц үг буруу байна.")
      }
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-5 py-10 sm:py-24">
      <Reveal from="load">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-8">
        {loading && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card/90 px-6 text-center backdrop-blur-sm"
            role="status"
            aria-live="polite"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-display text-lg font-bold">Нэвтэрч байна…</p>
            <p className="text-sm text-muted-foreground">
              Сесс үүсгэж, самбарыг ачаалж байна
            </p>
          </div>
        )}
        <Logo className="mb-6" />
        <h1 className="font-display text-2xl font-extrabold">Админ нэвтрэх</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          LOGONEST удирдлагын самбар
        </p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input
            label="Имэйл"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@logonest.mn"
            required
            disabled={loading}
          />
          <Input
            label="Нууц үг"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          {err && <p className="text-sm text-primary">{err}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </Button>
        </form>
        <Link href="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-primary">
          ← Нүүр хуудас
        </Link>
      </div>
      </Reveal>
    </div>
  )
}
