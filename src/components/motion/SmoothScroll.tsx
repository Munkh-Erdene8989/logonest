"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "@/lib/gsap-register"
import { prefersReducedMotion } from "@/lib/reduced-motion"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)
  const enabled = !pathname.startsWith("/admin")

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      autoRaf: false,
    })
    lenisRef.current = lenis
    lenis.on("scroll", ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled])

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  return children
}
