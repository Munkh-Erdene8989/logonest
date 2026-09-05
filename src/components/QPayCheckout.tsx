"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, ExternalLink, Loader2, QrCode, RefreshCw, Smartphone } from "lucide-react"
import { checkOrderPaymentAction, getOrderPaymentAction, retryOrderInvoiceAction } from "@/lib/actions/public"
import { formatMNT } from "@/lib/format"
import type { OrderPayment } from "@/lib/types"
import { Button, cx } from "@/components/ui"

function qrSrc(image?: string) {
  if (!image) return ""
  return image.startsWith("data:") ? image : `data:image/png;base64,${image}`
}

export function QPayCheckout({
  code,
  total,
  initial,
  onPaid,
}: {
  code: string
  total: number
  initial?: OrderPayment
  onPaid?: () => void
}) {
  const [payment, setPayment] = useState<OrderPayment | undefined>(initial)
  const [checking, setChecking] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState(initial?.error ?? "")
  const paid = payment?.status === "paid"

  const image = useMemo(() => qrSrc(payment?.qrImage), [payment?.qrImage])

  useEffect(() => {
    if (paid || !code) return
    let cancelled = false
    const tick = async () => {
      const res = await getOrderPaymentAction(code)
      if (cancelled || "ok" in res) return
      if (res.status === "paid") {
        setPayment((prev) => ({ ...(prev ?? { status: "paid" }), status: "paid", paidAmount: res.paidAmount }))
        onPaid?.()
      }
    }
    const id = window.setInterval(tick, 4000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [code, paid, onPaid])

  async function checkNow() {
    setChecking(true)
    setError("")
    const res = await checkOrderPaymentAction(code)
    setChecking(false)
    if (res.error) setError(res.error)
    if (res.paid) {
      setPayment((prev) => ({ ...(prev ?? { status: "paid" }), status: "paid" }))
      onPaid?.()
    }
  }

  async function retry() {
    setRetrying(true)
    setError("")
    const res = await retryOrderInvoiceAction(code)
    setRetrying(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setPayment(res.payment)
  }

  if (paid) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
        <p className="mt-3 font-display text-lg font-bold">Төлбөр амжилттай</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatMNT(payment?.paidAmount ?? total)} · {code}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-medium">
        <QrCode className="h-4 w-4 text-primary" />
        QPay-ээр төлөх
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Банкны аппаараа QR уншуулна уу. Төлбөр ормогц захиалга автоматаар баталгаажна.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="mx-auto grid h-52 w-52 place-items-center rounded-2xl border border-border bg-white p-3">
          {image ? (
            // QPay returns a PNG; keep native img so base64 renders without next/image config.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="QPay QR" className="h-full w-full object-contain" />
          ) : (
            <div className="px-4 text-center text-sm text-muted-foreground">
              QR бэлэн болоогүй байна
            </div>
          )}
        </div>

        <div>
          <div className="font-display text-2xl font-extrabold text-primary">{formatMNT(total)}</div>
          <p className="mt-1 text-sm text-muted-foreground">Захиалга {code}</p>

          {payment?.shortUrl && (
            <a
              href={payment.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              QPay хуудас нээх <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          {payment?.urls && payment.urls.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Smartphone className="h-3.5 w-3.5" /> Банкны апп
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {payment.urls.map((bank) => (
                  <a
                    key={`${bank.name}-${bank.link}`}
                    href={bank.link}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border px-2 py-2.5 text-center transition-colors hover:border-primary"
                  >
                    {bank.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={bank.logo} alt="" className="h-8 w-8 rounded-md object-contain" />
                    ) : (
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-secondary text-[10px]">
                        {bank.name.slice(0, 2)}
                      </span>
                    )}
                    <span className="line-clamp-2 text-[11px] leading-tight">{bank.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-primary">{error}</p>}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={checkNow} disabled={checking} size="sm">
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Төлбөр шалгах
        </Button>
        {(!payment?.invoiceId || payment.status === "failed") && (
          <Button variant="outline" size="sm" onClick={retry} disabled={retrying}>
            {retrying ? "Үүсгэж байна..." : "Нэхэмжлэх дахин үүсгэх"}
          </Button>
        )}
      </div>
      <p className={cx("mt-3 text-xs text-muted-foreground")}>
        Төлсний дараа энэ хуудас автоматаар шинэчлэгдэнэ. Хэрэв шинэчлэгдэхгүй бол «Төлбөр шалгах» дарна уу.
      </p>
    </div>
  )
}
