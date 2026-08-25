import { useCallback, useEffect, useState } from "react"

// localStorage-д хадгалагдах, tab хооронд синк болдог хялбар state hook
export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* хадгалалт бүтэлгүйтвэл орхино */
    }
  }, [key, state])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue) as T)
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [key])

  const reset = useCallback(() => setState(initial), [initial])

  return [state, setState, reset] as const
}
