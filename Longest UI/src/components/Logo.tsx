import { cx } from "./ui"

/** Official LOGONEST LN monogram (Branding/logonest svg/logonets-1.svg). */
const LN_MARK_PATH =
  "M1184.79 427.267H1184.79V727.815H1110.62L1110.6 727.822L1110.59 727.815H1110.21V727.431L959.893 577.613V615.835H885.316V427.267L885.788 427.748L885.742 395.355L1110.21 618.772V427.267H1035.64V353H1184.79V427.267ZM809.576 653.317L923.437 652.968L998.596 727.234L809.576 727.649V727.815H735V353.001H809.576V653.317Z"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="735 353 449.79 374.822"
      className={cx("h-8 w-auto shrink-0 text-primary", className)}
      aria-hidden
    >
      <path fill="currentColor" d={LN_MARK_PATH} />
    </svg>
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
      <LogoMark className="h-8 w-auto" />
      {wordmark && (
        <span className="font-display text-[17px] font-extrabold tracking-tight">
          LOGONEST
        </span>
      )}
    </span>
  )
}
