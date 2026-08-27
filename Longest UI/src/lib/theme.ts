import { useEffect } from "react"
import { usePersistentState } from "./storage"

export type ThemeMode = "light" | "dark"

// Гэрэл/харанхуй горим — <html> дээр .dark класс тавьж, localStorage-д хадгална.
export function useTheme() {
  const [mode, setMode] = usePersistentState<ThemeMode>("hg_theme", "dark")

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", mode === "dark")
  }, [mode])

  return {
    mode,
    toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
  }
}
