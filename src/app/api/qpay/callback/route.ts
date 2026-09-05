import { NextResponse } from "next/server"
import { getQPayPayment } from "@/lib/qpay"
import { confirmInvoicePayment } from "@/lib/qpay-orders"

export const dynamic = "force-dynamic"

type CallbackPayload = {
  invoice_id?: string
  invoiceId?: string
  object_id?: string
  payment_id?: string
  qpay_payment_id?: string
  code?: string
}

function pick(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

async function parseBody(req: Request): Promise<CallbackPayload> {
  const contentType = req.headers.get("content-type") ?? ""
  try {
    if (contentType.includes("application/json")) {
      return (await req.json()) as CallbackPayload
    }
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData()
      return {
        invoice_id: pick(form.get("invoice_id")),
        object_id: pick(form.get("object_id")),
        payment_id: pick(form.get("payment_id")),
        qpay_payment_id: pick(form.get("qpay_payment_id")),
        code: pick(form.get("code")),
      }
    }
    const text = await req.text()
    if (!text) return {}
    return JSON.parse(text) as CallbackPayload
  } catch {
    return {}
  }
}

async function handle(req: Request) {
  const url = new URL(req.url)
  const query = url.searchParams
  const body = req.method === "GET" ? {} : await parseBody(req)

  const code = pick(query.get("code")) || pick(body.code)
  let invoiceId =
    pick(query.get("invoice_id")) ||
    pick(body.invoice_id) ||
    pick(body.invoiceId) ||
    pick(query.get("object_id")) ||
    pick(body.object_id)
  const paymentId =
    pick(query.get("payment_id")) ||
    pick(query.get("qpay_payment_id")) ||
    pick(body.payment_id) ||
    pick(body.qpay_payment_id)

  try {
    if (!invoiceId && paymentId) {
      const payment = await getQPayPayment(paymentId)
      invoiceId = payment.invoiceId ?? ""
    }
    if (!invoiceId && code) {
      const { findOrderByInvoice } = await import("@/lib/qpay-orders")
      const order = await findOrderByInvoice("", code)
      invoiceId = order?.qpayInvoiceId ?? order?.payment?.invoiceId ?? ""
    }
    if (!invoiceId) {
      return NextResponse.json({ ok: false, error: "invoice_id missing" }, { status: 400 })
    }

    const result = await confirmInvoicePayment(invoiceId, code || undefined)
    return NextResponse.json({ ok: true, paid: result.paid })
  } catch (err) {
    console.error("QPay callback failed", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET(req: Request) {
  return handle(req)
}

export async function POST(req: Request) {
  return handle(req)
}
