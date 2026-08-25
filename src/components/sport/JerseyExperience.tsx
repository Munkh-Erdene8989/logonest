"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Diamond, Leaf, Wind } from "lucide-react"
import "@/lib/gsap-register"
import { prefersReducedMotion } from "@/lib/reduced-motion"
import { cx } from "@/components/ui"
import { BENEFITS, CHAPTERS, KEYFRAMES } from "./chapters"
import { jerseyScroll } from "./jersey-state"

const JerseyCanvas = dynamic(
  () => import("./JerseyCanvas").then((m) => m.JerseyCanvas),
  { ssr: false },
)

const BENEFIT_ICONS = {
  breath: Wind,
  stitch: Diamond,
  light: Leaf,
} as const

function CtaLink({ className }: { className?: string }) {
  return (
    <Link
      href="/order"
      className={cx(
        "pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_rgb(8_203_0/0.35)] transition-transform duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] motion-reduce:transform-none",
        className,
      )}
    >
      Загвараа бүтээх
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  )
}

function ChapterCopy({
  chapter,
  className,
}: {
  chapter: (typeof CHAPTERS)[number]
  className?: string
}) {
  return (
    <div
      className={cx(
        "max-w-md",
        chapter.align === "center" && "mx-auto text-center",
        chapter.align === "right" && "ml-auto text-right",
        className,
      )}
    >
      {chapter.kicker && (
        <p className="font-mono text-[11px] tracking-[0.22em] text-primary">
          {chapter.kicker}
        </p>
      )}
      <h2
        className={cx(
          "mt-3 font-display font-extrabold tracking-tight text-white",
          chapter.id === "hero" || chapter.id === "finale"
            ? "text-5xl sm:text-7xl"
            : "text-3xl sm:text-5xl",
        )}
      >
        {chapter.title}
      </h2>
      {chapter.body && (
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-white/65 sm:text-lg">
          {chapter.body}
        </p>
      )}
      {chapter.showCta && <CtaLink className="mt-8" />}
      {chapter.showBenefits && (
        <ul
          className={cx(
            "mt-10 flex flex-wrap gap-x-8 gap-y-4",
            chapter.align === "center" && "justify-center",
          )}
        >
          {BENEFITS.map((b) => {
            const Icon = BENEFIT_ICONS[b.id]
            return (
              <li key={b.id} className="flex items-center gap-3 text-sm text-white/80">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/40 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                {b.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ReducedExperience() {
  return (
    <div className="bg-[#050505] text-white">
      <section className="relative min-h-screen">
        <Image
          src="/jersey/hero.jpg"
          alt="LOGONEST спорт цамц"
          fill
          priority
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-5 pb-20 pt-28 sm:px-8">
          <ChapterCopy chapter={CHAPTERS[0]} />
        </div>
      </section>
      {CHAPTERS.slice(1).map((ch) => (
        <section key={ch.id} className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <ChapterCopy chapter={ch} />
        </section>
      ))}
    </div>
  )
}

export function JerseyExperience() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    document.documentElement.classList.add("sport-studio")
    return () => document.documentElement.classList.remove("sport-studio")
  }, [])

  useGSAP(
    () => {
      if (reduced || !wrapRef.current) return

      const first = KEYFRAMES[0]
      gsap.set(jerseyScroll, {
        rotationY: first.rotationY,
        rotationX: first.rotationX,
        rotationZ: first.rotationZ,
        camX: first.camX,
        camY: first.camY,
        camZ: first.camZ,
        lookX: first.lookX,
        lookY: first.lookY,
        lookZ: first.lookZ,
        fov: first.fov,
        fabric: first.fabric,
        stitch: first.stitch,
        vent: first.vent,
        construct: first.construct,
        progress: 0,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      })

      let t = 0
      for (let i = 1; i < KEYFRAMES.length; i++) {
        const prev = KEYFRAMES[i - 1]
        const kf = KEYFRAMES[i]
        tl.to(
          jerseyScroll,
          {
            rotationY: kf.rotationY,
            rotationX: kf.rotationX,
            rotationZ: kf.rotationZ,
            camX: kf.camX,
            camY: kf.camY,
            camZ: kf.camZ,
            lookX: kf.lookX,
            lookY: kf.lookY,
            lookZ: kf.lookZ,
            fov: kf.fov,
            fabric: kf.fabric,
            stitch: kf.stitch,
            vent: kf.vent,
            construct: kf.construct,
            progress: kf.t,
            duration: kf.t - prev.t,
          },
          t,
        )
        t += kf.t - prev.t
      }

      CHAPTERS.forEach((ch, i) => {
        const el = overlayRefs.current[i]
        if (!el) return
        const last = i === CHAPTERS.length - 1
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 28 })
        if (i === 0) {
          tl.to(el, { autoAlpha: 0, y: -18, duration: 0.045 }, ch.fadeOut)
          return
        }
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.05 },
          ch.fadeIn,
        )
        if (!last) tl.to(el, { autoAlpha: 0, y: -16, duration: 0.04 }, ch.fadeOut)
      })

      if (barRef.current) {
        gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left center" })
        tl.to(barRef.current, { scaleX: 1, duration: 1, ease: "none" }, 0)
      }
      if (hintRef.current) {
        tl.to(hintRef.current, { autoAlpha: 0, duration: 0.06 }, 0.04)
      }

      requestAnimationFrame(() => ScrollTrigger.refresh())
    },
    { dependencies: [reduced] },
  )

  if (reduced) return <ReducedExperience />

  return (
    <div ref={wrapRef} className="relative h-[800vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <JerseyCanvas />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,#050505_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />

        {CHAPTERS.map((ch, i) => (
          <div
            key={ch.id}
            ref={(el) => {
              overlayRefs.current[i] = el
            }}
            className="pointer-events-none absolute inset-0 flex items-center"
          >
            <div className="mx-auto flex h-full w-full max-w-6xl items-end px-5 pb-24 pt-20 sm:px-8 md:items-center md:pb-0">
              {ch.id === "hero" && (
                <>
                  <p className="absolute left-8 top-1/2 hidden origin-left -translate-y-1/2 -rotate-90 font-mono text-[11px] tracking-[0.22em] text-white/70 lg:block">
                    <span className="text-primary">Гүйцэтгэл</span> онцлогтойгоо нийлнэ
                  </p>
                  <p className="absolute right-8 top-24 hidden font-mono text-[11px] tracking-[0.18em] text-white/80 md:block">
                    Илүү{" "}
                    <span className="text-white underline decoration-primary decoration-2 underline-offset-4">
                      том
                    </span>{" "}
                    зорилгод зориулсан
                  </p>
                </>
              )}
              <ChapterCopy chapter={ch} />
            </div>
          </div>
        ))}

        <p
          ref={hintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.28em] text-white/40"
        >
          Гүйлгэ
        </p>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
          <div ref={barRef} className="h-full origin-left bg-primary" />
        </div>
      </div>
    </div>
  )
}
