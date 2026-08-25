import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, Moon, Search, Sun, X } from "lucide-react"
import { useTheme } from "../lib/theme"
import { Logo } from "./Logo"
import { ButtonLink } from "./ui"

const LINKS = [
  { to: "/products", label: "Бүтээгдэхүүн" },
  { to: "/calculator", label: "Үнэ тооцоолуур" },
  { to: "/track", label: "Захиалга хянах" },
  { to: "/news", label: "Мэдээ" },
  { to: "/contact", label: "Холбоо барих" },
]

function ThemeToggle() {
  const { mode, toggle } = useTheme()
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

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            to="/products"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Хайх"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ButtonLink to="/order" size="sm">
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
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground/80"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <ButtonLink to="/order" className="mt-2" size="md">
              Захиалга өгөх
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  )
}
