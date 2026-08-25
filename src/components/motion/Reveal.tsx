"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import "@/lib/gsap-register"
import { prefersReducedMotion } from "@/lib/reduced-motion"
import { cx } from "@/components/ui"

type RevealProps = {
  children: React.ReactNode
  className?: string
  y?: number
  delay?: number
  stagger?: number
  duration?: number
  from?: "scroll" | "load"
  once?: boolean
}

export function Reveal({
  children,
  className,
  y = 18,
  delay = 0,
  stagger,
  duration = 0.5,
  from = "scroll",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const targets = stagger != null ? el.children : el

      if (prefersReducedMotion()) {
        gsap.set(targets, { autoAlpha: 1, y: 0 })
        return
      }

      const tween = {
        autoAlpha: 1,
        y: 0,
        duration,
        delay,
        ease: "power2.out",
        stagger: stagger ?? 0,
        overwrite: "auto" as const,
      }

      if (from === "load") {
        gsap.fromTo(targets, { autoAlpha: 0, y }, tween)
        return
      }

      gsap.fromTo(targets, { autoAlpha: 0, y }, {
        ...tween,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once,
        },
      })
    },
    { scope: ref, dependencies: [y, delay, stagger, duration, from, once] },
  )

  return (
    <div ref={ref} className={cx(className)}>
      {children}
    </div>
  )
}
