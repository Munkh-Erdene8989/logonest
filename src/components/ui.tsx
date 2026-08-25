import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"
import Link from "next/link"

function cx(...parts: (string | false | undefined | null)[]) {
  return parts.filter(Boolean).join(" ")
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const btnBase =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"

const btnVariant = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/25",
  outline: "border border-border bg-card text-foreground hover:border-primary hover:text-primary",
  ghost: "text-foreground hover:bg-secondary",
}
const btnSize = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cx(btnBase, btnVariant[variant], btnSize[size], className)} {...props} />
  )
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  children: ReactNode
}) {
  return (
    <Link href={href} className={cx(btnBase, btnVariant[variant], btnSize[size], className)}>
      {children}
    </Link>
  )
}

export function Input({
  className,
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      )}
      <input
        className={cx(
          "w-full rounded-xl border border-border bg-card px-4 h-11 text-foreground placeholder:text-muted-foreground transition-colors duration-200 motion-reduce:transition-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          className,
        )}
        {...props}
      />
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function Select({
  className,
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      )}
      <select
        className={cx(
          "w-full rounded-xl border border-border bg-card px-4 h-11 text-foreground transition-colors duration-200 motion-reduce:transition-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export function Textarea({
  className,
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      )}
      <textarea
        className={cx(
          "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors duration-200 motion-reduce:transition-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          className,
        )}
        {...props}
      />
    </label>
  )
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium font-mono",
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cx("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary">
      <span className="h-2 w-2 rounded-full bg-primary" />
      {children}
    </span>
  )
}

export { cx }
