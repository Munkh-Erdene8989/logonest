import { adminDb } from "@/lib/firebase/admin"
import {
  checkQPayInvoice,
  createQPayInvoice,
  isInvoicePaid,
  resolvePublicBaseUrl,
  type QPayInvoice,
} from "@/lib/qpay"
import type { Order, OrderPayment } from "@/lib/types"

function toPayment(invoice: QPayInvoice): OrderPayment {
  return {
    status: "unpaid",
    invoiceId: invoice.invoiceId,
    qrImage: invoice.qrImage,
    shortUrl: invoice.shortUrl,
    urls: invoice.urls,
  }
}

export async function issueInvoiceForOrder(order: Order): Promise<OrderPayment> {
  const base = await resolvePublicBaseUrl()
  const callbackUrl = `${base}/api/qpay/callback?code=${encodeURIComponent(order.code)}`
  const invoice = await createQPayInvoice({
    senderInvoiceNo: order.code,
    amount: order.total,
    description: `${order.code} · ${order.productName}`.slice(0, 240),
    receiverCode: order.phoneNormalized || order.customer.phone || "terminal",
    callbackUrl,
  })

  const payment = toPayment(invoice)
  await adminDb().collection("orders").doc(order.code).update({
    qpayInvoiceId: invoice.invoiceId,
    payment,
  })
  return payment
}

export async function findOrderByInvoice(invoiceId: string, code?: string): Promise<Order | null> {
  const db = adminDb()
  if (code) {
    const doc = await db.collection("orders").doc(code).get()
    if (doc.exists) return { ...(doc.data() as Order), code: doc.id }
  }
  const snap = await db.collection("orders").where("qpayInvoiceId", "==", invoiceId).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { ...(doc.data() as Order), code: doc.id }
}

export async function confirmInvoicePayment(
  invoiceId: string,
  orderCode?: string,
): Promise<{ paid: boolean; order?: Order; paidAmount?: number; paymentId?: string }> {
  const order = await findOrderByInvoice(invoiceId, orderCode)
  if (!order) return { paid: false }

  if (order.payment?.status === "paid") {
    return {
      paid: true,
      order,
      paidAmount: order.payment.paidAmount,
      paymentId: order.payment.paymentId,
    }
  }

  const check = await checkQPayInvoice(invoiceId)
  if (!isInvoicePaid(check, order.total)) {
    return { paid: false, order, paidAmount: check.paidAmount }
  }

  const paidRow = check.rows.find((row) => String(row.payment_status ?? "").toUpperCase() === "PAID") ?? check.rows[0]
  const now = new Date().toISOString()
  const payment: OrderPayment = {
    ...(order.payment ?? { status: "paid" }),
    status: "paid",
    invoiceId,
    paymentId: paidRow?.payment_id,
    paidAt: now,
    paidAmount: check.paidAmount || Number(paidRow?.payment_amount ?? order.total),
  }

  const timeline = Array.isArray(order.timeline) ? order.timeline : []
  await adminDb()
    .collection("orders")
    .doc(order.code)
    .update({
      payment,
      qpayInvoiceId: invoiceId,
      timeline: [...timeline, { status: order.status, at: now, note: "QPay төлбөр баталгаажлаа" }],
    })

  return {
    paid: true,
    order: { ...order, payment, qpayInvoiceId: invoiceId },
    paidAmount: payment.paidAmount,
    paymentId: payment.paymentId,
  }
}
