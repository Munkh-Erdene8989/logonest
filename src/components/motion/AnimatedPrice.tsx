"use client"

import { useEffect, useState } from "react"
import { animate, useMotionValue, useMotionValueEvent } from "motion/react"
import { formatMNT } from "@/lib/format"
import { prefersReducedMotion } from "@/lib/reduced-motion"

export function AnimatedPrice({ value, valid }: { value: number; valid: boolean }) {
  const mv = useMotionValue(value)
  const [shown, setShown] = useState(value)

  useMotionValueEvent(mv, "change", (v) => setShown(v))

  useEffect(() => {
    if (!valid) return
    if (prefersReducedMotion()) {
      mv.set(value)
      setShown(value)
      return
    }
    const controls = animate(mv, value, {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [value, valid, mv])

  if (!valid) return "—"
  return formatMNT(shown)
}
