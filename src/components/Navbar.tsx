"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Moon, Search, Sun, X } from "lucide-react"
import { Logo } from "./Logo"
import { ButtonLink, cx } from "./ui"

const LINKS = [
  { href: "/products", label: "Бүтээгдэхүүн" },
  { href: "/calculator", label: "Үнэ тооцоолуур" },
  { href: "/track", label: "Захиалга хянах" },
  { href: "/news", label: "Мэдээ" },
  { href: "/contact", label: "Холбоо барих" },
]

function ThemeToggle() {
  const [mode, setMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("hg_theme")
      const stored = raw ? (JSON.parse(raw) as "light" | "dark") : "light"
      setMode(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    } catch {
      /* ignore */
    }
  }, [])

  function toggle() {
    const next = mode === "dark" ? "light" : "dark"
    setMode(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    window.localStorage.setItem("hg_theme", JSON.stringify(next))
  }

  return (
    <button
      onClick={toggle}
      className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
      aria-label={mode === "dark" ? "Гэрэл горим" : "Харанхуй горим"}
    >
      {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-foreground/70 hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            href="/products"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Хайх"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ButtonLink href="/order" size="sm">
            Захиалга өгөх
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Цэс"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
            {LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "rounded-xl px-4 py-3 text-sm font-medium",
                    active ? "bg-accent text-accent-foreground" : "text-foreground/80",
                  )}
                >
                  {l.label}
                </Link>
              )
            })}
            <ButtonLink href="/order" className="mt-2" size="md">
              Захиалга өгөх
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  )
}
