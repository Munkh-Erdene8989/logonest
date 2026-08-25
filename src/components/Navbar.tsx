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

function isSportPath(pathname: string) {
  return pathname === "/sport" || pathname.startsWith("/sport/")
}

function ThemeToggle({ light }: { light?: boolean }) {
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
      className={cx(
        "grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 motion-reduce:transition-none",
        light
          ? "text-white/70 hover:bg-white/10 hover:text-white"
          : "text-foreground/70 hover:bg-secondary hover:text-foreground",
      )}
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

function SportNavLink({
  mobile,
  onClick,
}: {
  mobile?: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const active = isSportPath(pathname)

  return (
    <Link
      href="/sport"
      onClick={onClick}
      className={cx(
        "sport-nav-link relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full border border-primary/45 bg-primary/10 font-medium text-primary",
        mobile ? "my-1 h-11 w-full justify-between px-4 text-sm" : "h-9 px-3 text-sm",
        active && "border-primary bg-primary/20",
      )}
    >
      <span className="sport-nav-shimmer" aria-hidden />
      <span className="relative">Спорт хувцас</span>
      <span className="relative grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[8px] font-extrabold leading-none tracking-wide text-primary-foreground">
        3D
      </span>
    </Link>
  )
}

function isAdminDashboard(pathname: string) {
  return (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    pathname !== "/admin/login"
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const sport = isSportPath(pathname)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (isAdminDashboard(pathname)) return null

  return (
    <header
      className={cx(
        "z-50 border-b backdrop-blur-md",
        sport
          ? "fixed inset-x-0 top-0 border-white/10 bg-black/35 text-white"
          : "sticky top-0 border-border/70 bg-background/85",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
          <Logo className={sport ? "text-white" : undefined} />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          <SportNavLink />
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cx(
                  "inline-flex h-9 items-center whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none",
                  sport
                    ? active
                      ? "text-primary"
                      : "text-white/70 hover:text-white"
                    : active
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <ThemeToggle light={sport} />
          <Link
            href="/products"
            className={cx(
              "grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 motion-reduce:transition-none",
              sport
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-foreground/70 hover:bg-secondary hover:text-foreground",
            )}
            aria-label="Хайх"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ButtonLink href="/order" size="sm">
            Захиалга өгөх
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle light={sport} />
          <button
            className={cx(
              "grid h-10 w-10 place-items-center rounded-xl border",
              sport ? "border-white/20" : "border-border",
            )}
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
            className={cx(
              "overflow-hidden border-t lg:hidden",
              sport ? "border-white/10 bg-black/95" : "border-border bg-background",
            )}
          >
            <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8">
              <SportNavLink mobile onClick={() => setOpen(false)} />
              {LINKS.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cx(
                      "rounded-xl px-4 py-3 text-sm font-medium",
                      sport
                        ? active
                          ? "bg-primary/15 text-primary"
                          : "text-white/80"
                        : active
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/80",
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
