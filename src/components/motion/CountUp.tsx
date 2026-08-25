"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import "@/lib/gsap-register"
import { prefersReducedMotion } from "@/lib/reduced-motion"

function parseLabeledNumber(raw: string) {
  const match = raw.match(/^([^\d]*)([\d.,]+)(.*)$/)
  if (!match) return { prefix: "", amount: 0, suffix: raw }
  return {
    prefix: match[1],
    amount: Number(match[2].replace(/,/g, "")),
    suffix: match[3],
  }
}

function defaultFormat(n: number) {
  return new Intl.NumberFormat("mn-MN", { maximumFractionDigits: 0 }).format(Math.round(n))
}

export function CountUp({
  to,
  value,
  duration = 0.7,
  className,
  format,
}: {
  to?: number
  value?: string
  duration?: number
  className?: string
  format?: (n: number) => string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const parsed = value ? parseLabeledNumber(value) : { prefix: "", amount: to ?? 0, suffix: "" }
  const target = parsed.amount
  const fmt =
    format ?? ((n: number) => `${parsed.prefix}${defaultFormat(n)}${parsed.suffix}`)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (prefersReducedMotion()) {
        el.textContent = fmt(target)
        return
      }

      const obj = { n: 0 }
      gsap.to(obj, {
        n: target,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = fmt(obj.n)
        },
      })
    },
    { dependencies: [target, duration] },
  )

  return (
    <span ref={ref} className={className}>
      {fmt(0)}
    </span>
  )
}
