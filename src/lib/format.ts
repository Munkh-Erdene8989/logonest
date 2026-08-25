export function formatMNT(value: number): string {
  return (
    new Intl.NumberFormat("mn-MN", {
      maximumFractionDigits: 0,
    }).format(Math.round(value)) + "₮"
  )
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function makeOrderCode(): string {
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `LN-${rnd}`
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "")
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fallback */
  }
  try {
    const ta = document.createElement("textarea")
    ta.value = text
    ta.style.position = "fixed"
    ta.style.opacity = "0"
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
