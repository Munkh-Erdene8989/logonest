"use server"

import { adminBucket, adminDb } from "@/lib/firebase/admin"
import { asOrder } from "@/lib/data"
import { makeOrderCode, normalizePhone } from "@/lib/format"
import { qpayConfigured } from "@/lib/qpay"
import { confirmInvoicePayment, issueInvoiceForOrder } from "@/lib/qpay-orders"
import type { Order, OrderPayment } from "@/lib/types"

const ALLOWED_EXT = new Set(["pdf", "ai", "psd", "jpg", "jpeg", "png", "tif", "tiff"])
const MAX_FILE = 20 * 1024 * 1024

export async function createOrderAction(formData: FormData): Promise<
  { ok: true; code: string; total: number; payment?: OrderPayment } | { ok: false; error: string }
> {
  const productName = String(formData.get("productName") ?? "").trim()
  const spec = String(formData.get("spec") ?? "").trim()
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1))
  const total = Math.max(0, Number(formData.get("total") ?? 0))
  const name = String(formData.get("name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const note = String(formData.get("note") ?? "").trim()
  const file = formData.get("file")

  if (!productName || !name || normalizePhone(phone).length < 6) {
    return { ok: false, error: "Нэр болон утасны дугаараа оруулна уу." }
  }

  const db = adminDb()
  let code = makeOrderCode()
  for (let i = 0; i < 5; i++) {
    const existing = await db.collection("orders").doc(code).get()
    if (!existing.exists) break
    code = makeOrderCode()
  }

  let fileName: string | undefined
  let fileUrl: string | undefined

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE) {
      return { ok: false, error: "Файл 20MB-аас хэтэрч болохгүй." }
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (!ALLOWED_EXT.has(ext)) {
      return { ok: false, error: "Зөвшөөрөгдсөн формат: PDF, AI, PSD, JPG, PNG, TIFF." }
    }
    fileName = file.name.replace(/[^\w.\-а-яА-ЯөүёӨҮЁ ]/gi, "_")
    try {
      const bucket = adminBucket()
      const path = `orders/${code}/${fileName}`
      const buffer = Buffer.from(await file.arrayBuffer())
      const gfile = bucket.file(path)
      await gfile.save(buffer, {
        metadata: { contentType: file.type || "application/octet-stream" },
      })
      const [signed] = await gfile.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 5,
      })
      fileUrl = signed
    } catch (err) {
      console.error("Storage upload failed, keeping filename only", err)
    }
  }

  const now = new Date().toISOString()
  const order: Order = {
    code,
    createdAt: now,
    status: "received",
    productName,
    spec,
    quantity,
    total,
    customer: { name, phone, email, note: note || undefined },
    fileName,
    fileUrl,
    timeline: [{ status: "received", at: now, note: "Захиалга хүлээн авлаа" }],
    phoneNormalized: normalizePhone(phone),
    emailLower: email.toLowerCase(),
  }

  await db.collection("orders").doc(code).set(order)

  if (!qpayConfigured() || total < 1) {
    return { ok: true, code, total }
  }

  try {
    const payment = await issueInvoiceForOrder(order)
    return { ok: true, code, total, payment }
  } catch (err) {
    const message = err instanceof Error ? err.message : "QPay нэхэмжлэх үүсгэж чадсангүй"
    console.error("QPay invoice failed", err)
    const payment: OrderPayment = { status: "failed", error: message }
    await db.collection("orders").doc(code).update({ payment })
    return { ok: true, code, total, payment }
  }
}

export async function trackOrdersAction(query: string): Promise<Order[]> {
  const term = query.trim()
  if (!term) return []
  const db = adminDb()

  const asCode = term.toUpperCase().startsWith("LN-")
    ? term.toUpperCase()
    : term.toUpperCase().startsWith("LN")
      ? term.toUpperCase()
      : null

  if (asCode || /^LN-/i.test(term)) {
    const code = term.toUpperCase()
    const doc = await db.collection("orders").doc(code).get()
    return doc.exists ? [asOrder(doc.id, doc.data()!)] : []
  }

  if (term.includes("@")) {
    const snap = await db
      .collection("orders")
      .where("emailLower", "==", term.toLowerCase())
      .get()
    return snap.docs.map((d) => asOrder(d.id, d.data()))
  }

  const phone = normalizePhone(term)
  if (phone.length >= 6) {
    const snap = await db
      .collection("orders")
      .where("phoneNormalized", "==", phone)
      .get()
    return snap.docs.map((d) => asOrder(d.id, d.data()))
  }

  const doc = await db.collection("orders").doc(term.toUpperCase()).get()
  return doc.exists ? [asOrder(doc.id, doc.data()!)] : []
}

export async function getOrderPaymentAction(
  code: string,
): Promise<{ status: OrderPayment["status"]; paidAmount?: number } | { ok: false; error: string }> {
  const id = code.trim().toUpperCase()
  if (!id) return { ok: false, error: "Захиалгын дугаар дутуу." }
  const doc = await adminDb().collection("orders").doc(id).get()
  if (!doc.exists) return { ok: false, error: "Захиалга олдсонгүй." }
  const order = asOrder(doc.id, doc.data()!)
  return {
    status: order.payment?.status ?? "unpaid",
    paidAmount: order.payment?.paidAmount,
  }
}

export async function checkOrderPaymentAction(
  code: string,
): Promise<{ paid: boolean; status: OrderPayment["status"]; error?: string }> {
  const id = code.trim().toUpperCase()
  if (!id) return { paid: false, status: "unpaid", error: "Захиалгын дугаар дутуу." }
  const doc = await adminDb().collection("orders").doc(id).get()
  if (!doc.exists) return { paid: false, status: "unpaid", error: "Захиалга олдсонгүй." }
  const order = asOrder(doc.id, doc.data()!)
  const invoiceId = order.qpayInvoiceId ?? order.payment?.invoiceId
  if (!invoiceId) return { paid: false, status: order.payment?.status ?? "unpaid" }
  try {
    const result = await confirmInvoicePayment(invoiceId, order.code)
    return {
      paid: result.paid,
      status: result.paid ? "paid" : (order.payment?.status ?? "unpaid"),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Төлбөр шалгаж чадсангүй"
    return { paid: false, status: order.payment?.status ?? "unpaid", error: message }
  }
}

export async function retryOrderInvoiceAction(
  code: string,
): Promise<{ ok: true; payment: OrderPayment } | { ok: false; error: string }> {
  const id = code.trim().toUpperCase()
  if (!id) return { ok: false, error: "Захиалгын дугаар дутуу." }
  const doc = await adminDb().collection("orders").doc(id).get()
  if (!doc.exists) return { ok: false, error: "Захиалга олдсонгүй." }
  const order = asOrder(doc.id, doc.data()!)
  if (order.payment?.status === "paid") {
    return { ok: true, payment: order.payment }
  }
  if (order.qpayInvoiceId && order.payment?.invoiceId) {
    return { ok: true, payment: order.payment }
  }
  if (!qpayConfigured()) return { ok: false, error: "QPay тохиргоо дутуу байна." }
  if (order.total < 1) return { ok: false, error: "Төлбөрийн дүн буруу байна." }
  try {
    const payment = await issueInvoiceForOrder(order)
    return { ok: true, payment }
  } catch (err) {
    const message = err instanceof Error ? err.message : "QPay нэхэмжлэх үүсгэж чадсангүй"
    return { ok: false, error: message }
  }
}

export async function sendMessageAction(input: {
  name: string
  phone: string
  email: string
  body: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.name.trim() || !input.phone.trim() || !input.body.trim()) {
    return { ok: false, error: "Шаардлагатай талбаруудыг бөглөнө үү." }
  }
  const ref = adminDb().collection("messages").doc()
  await ref.set({
    id: ref.id,
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    body: input.body.trim(),
    read: false,
  })
  return { ok: true }
}
