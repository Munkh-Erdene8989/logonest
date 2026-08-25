import { cx } from "./ui"

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary",
        className,
      )}
    >
      <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden>
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fill="#06180a"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="15"
          fontWeight="800"
          letterSpacing="-0.5"
        >
          LN
        </text>
      </svg>
    </span>
  )
}

export function Logo({
  className,
  wordmark = true,
}: {
  className?: string
  wordmark?: boolean
}) {
  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9" />
      {wordmark && (
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
          LOGONEST
        </span>
      )}
    </span>
  )
}
