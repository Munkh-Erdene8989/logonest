"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
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
      className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 transition-colors duration-200 hover:bg-secondary hover:text-foreground motion-reduce:transition-none"
      aria-label={mode === "dark" ? "Гэрэл горим" : "Харанхуй горим"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="grid place-items-center"
        >
          {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

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
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
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
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 transition-colors duration-200 hover:bg-secondary hover:text-foreground motion-reduce:transition-none"
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
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
