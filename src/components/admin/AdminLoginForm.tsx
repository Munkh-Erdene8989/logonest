"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase/client"
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
        body: JSON.stringify({ idToken }),
      })
      if (!res.ok) throw new Error("session")
      router.push("/admin")
      router.refresh()
    } catch {
      setErr("Имэйл эсвэл нууц үг буруу байна.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-5 py-24">
      <div className="rounded-3xl border border-border bg-card p-8">
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
          />
          <Input
            label="Нууц үг"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {err && <p className="text-sm text-primary">{err}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </Button>
        </form>
        <Link href="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-primary">
          ← Нүүр хуудас
        </Link>
      </div>
    </div>
  )
}
