"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import "@/lib/gsap-register"
import { prefersReducedMotion } from "@/lib/reduced-motion"

export function Parallax({
  children,
  className,
  distance = 12,
}: {
  children: React.ReactNode
  className?: string
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      gsap.to(el, {
        y: distance,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    },
    { scope: ref, dependencies: [distance] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
