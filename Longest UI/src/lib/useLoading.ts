import { useEffect, useState } from "react"

// Demo дата шууд байдаг тул skeleton bone-г харуулахын тулд богино зохиомол
// ачааллын хугацаа симуляц хийнэ.
export function useFakeLoading(ms = 650, deps: unknown[] = []) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return loading
}
