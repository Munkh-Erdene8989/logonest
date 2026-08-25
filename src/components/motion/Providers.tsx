"use client"

import { MotionProvider } from "./MotionProvider"
import { SmoothScroll } from "./SmoothScroll"

export function MotionStack({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </MotionProvider>
  )
}
