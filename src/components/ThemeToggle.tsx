"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Moon, Sun } from "lucide-react"
import { cx } from "./ui"

export type ThemeMode = "light" | "dark"

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark")
  document.documentElement.style.colorScheme = mode
}

export function ThemeToggle({ light, className }: { light?: boolean; className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("dark")

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("hg_theme")
      const stored = raw ? (JSON.parse(raw) as ThemeMode) : "dark"
      setMode(stored)
      applyTheme(stored)
    } catch {
      applyTheme("dark")
    }
  }, [])

  function toggle() {
    const next: ThemeMode = mode === "dark" ? "light" : "dark"
    setMode(next)
    applyTheme(next)
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
        className,
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
