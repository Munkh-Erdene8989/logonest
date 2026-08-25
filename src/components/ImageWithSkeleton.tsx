"use client"

import { useCallback, useState } from "react"
import Image, { type ImageProps } from "next/image"
import { cx } from "./ui"

export function ImageWithSkeleton({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  const markLoaded = useCallback(() => setLoaded(true), [])

  return (
    <>
      {!loaded && <div className="skeleton absolute inset-0 z-[1]" aria-hidden />}
      <Image
        {...props}
        className={cx(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth > 0) markLoaded()
          onLoad?.(event)
        }}
        ref={(img) => {
          if (img?.complete && img.naturalWidth > 0) markLoaded()
        }}
      />
    </>
  )
}
