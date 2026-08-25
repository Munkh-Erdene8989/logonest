import logoUrl from "../imports/logonets-7-1.png"
import { cx } from "./ui"

// LOGONEST брэндийн жинхэнэ "LN" лого (PNG). Эх зурган дээрх голын ногоон
// дөрвөлжинг таслан авч, дурын хэмжээнд цэвэрхэн харагдуулна.
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "relative inline-flex shrink-0 overflow-hidden rounded-lg",
        className,
      )}
    >
      <img
        src={logoUrl}
        alt="LOGONEST"
        className="h-full w-full origin-center scale-[3.6] object-contain"
      />
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
