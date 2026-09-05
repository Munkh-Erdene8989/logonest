import { headers } from "next/headers"

export type QPayBankUrl = {
  name: string
  description: string
  logo: string
  link: string
}

export type QPayInvoice = {
  invoiceId: string
  qrText: string
  qrImage: string
  shortUrl: string
  urls: QPayBankUrl[]
}

export type QPayPaymentRow = {
  payment_id?: string
  payment_status?: string
  payment_amount?: string | number
  payment_currency?: string
}

export type QPayCheckResult = {
  count: number
  paidAmount: number
  rows: QPayPaymentRow[]
}

type TokenCache = {
  accessToken: string
  refreshToken: string
  accessExpiresAt: number
  refreshExpiresAt: number
}

let tokenCache: TokenCache | null = null
let tokenInFlight: Promise<string> | null = null

function env(name: string): string {
  return (process.env[name] ?? "").trim().replace(/^["']|["']$/g, "")
}

export function qpayConfigured(): boolean {
  return Boolean(env("QPAY_CLIENT_ID") && env("QPAY_CLIENT_SECRET") && env("QPAY_INVOICE_CODE"))
}

function baseUrl(): string {
  return env("QPAY_BASE_URL") || "https://merchant.qpay.mn"
}

function invoiceCode(): string {
  return env("QPAY_INVOICE_CODE")
}

function basicAuth(): string {
  return Buffer.from(`${env("QPAY_CLIENT_ID")}:${env("QPAY_CLIENT_SECRET")}`).toString("base64")
}

async function qpayFetch<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers: extra, ...rest } = init
  const res = await fetch(`${baseUrl()}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    },
    cache: "no-store",
  })
  const text = await res.text()
  let body: unknown = {}
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = { message: text }
    }
  }
  if (!res.ok) {
    const err = body as { error?: string; error_code?: string; message?: string; error_description?: string }
    const message =
      err.message || err.error_description || err.error || err.error_code || `QPay ${res.status}`
    throw new QPayError(message, res.status, err.error_code)
  }
  return body as T
}

export class QPayError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "QPayError"
    this.status = status
    this.code = code
  }
}

type TokenResponse = {
  access_token: string
  refresh_token?: string
  expires_in?: number
  refresh_expires_in?: number
}

function expiryMs(value: number | undefined, fallbackSec: number, now: number): number {
  const raw = Number(value ?? fallbackSec)
  if (!Number.isFinite(raw) || raw <= 0) return now + fallbackSec * 1000
  // QPay sometimes returns a unix timestamp instead of a TTL in seconds.
  if (raw > 1_000_000_000) return raw * 1000 - 30_000
  return now + Math.max(30, raw - 30) * 1000
}

function storeToken(data: TokenResponse): string {
  const now = Date.now()
  tokenCache = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? "",
    accessExpiresAt: expiryMs(data.expires_in, 600, now),
    refreshExpiresAt: expiryMs(data.refresh_expires_in, 3600, now),
  }
  return data.access_token
}

async function requestToken(): Promise<string> {
  const data = await qpayFetch<TokenResponse>("/v2/auth/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basicAuth()}` },
  })
  if (!data.access_token) throw new QPayError("QPay token ирсэнгүй", 401)
  return storeToken(data)
}

async function refreshToken(refresh: string): Promise<string> {
  const data = await qpayFetch<TokenResponse>("/v2/auth/refresh", {
    method: "POST",
    token: refresh,
  })
  if (!data.access_token) throw new QPayError("QPay refresh амжилтгүй", 401)
  return storeToken(data)
}

async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.accessExpiresAt > now) return tokenCache.accessToken
  if (tokenInFlight) return tokenInFlight

  tokenInFlight = (async () => {
    try {
      if (tokenCache && tokenCache.refreshToken && tokenCache.refreshExpiresAt > now) {
        try {
          return await refreshToken(tokenCache.refreshToken)
        } catch {
          tokenCache = null
        }
      }
      return await requestToken()
    } finally {
      tokenInFlight = null
    }
  })()

  return tokenInFlight
}

async function withAuth<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const token = await getAccessToken()
  try {
    return await fn(token)
  } catch (err) {
    if (err instanceof QPayError && err.status === 401) {
      tokenCache = null
      return fn(await getAccessToken())
    }
    throw err
  }
}

export async function resolvePublicBaseUrl(): Promise<string> {
  const callback = env("QPAY_CALLBACK_URL")
  if (callback) return callback.replace(/\/api\/qpay\/callback\/?.*$/, "")

  const site = env("NEXT_PUBLIC_SITE_URL")
  if (site) return site.replace(/\/$/, "")

  const prod = env("VERCEL_PROJECT_PRODUCTION_URL")
  if (prod) return `https://${prod.replace(/^https?:\/\//, "")}`

  const vercel = env("VERCEL_URL")
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`

  try {
    const h = await headers()
    const host = h.get("x-forwarded-host") ?? h.get("host")
    const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http")
    if (host) return `${proto}://${host}`
  } catch {
    /* not in a request */
  }

  return "http://localhost:3000"
}

export async function createQPayInvoice(input: {
  senderInvoiceNo: string
  amount: number
  description: string
  receiverCode?: string
  callbackUrl: string
}): Promise<QPayInvoice> {
  if (!qpayConfigured()) {
    throw new QPayError("QPay тохиргоо дутуу байна", 500)
  }
  const amount = Math.round(input.amount)
  if (amount < 1) throw new QPayError("Төлбөрийн дүн буруу байна", 400)

  const data = await withAuth((token) =>
    qpayFetch<{
      invoice_id?: string
      qr_text?: string
      qr_image?: string
      qPay_shortUrl?: string
      urls?: QPayBankUrl[]
    }>("/v2/invoice", {
      method: "POST",
      token,
      body: JSON.stringify({
        invoice_code: invoiceCode(),
        sender_invoice_no: input.senderInvoiceNo,
        invoice_receiver_code: input.receiverCode || "terminal",
        invoice_description: input.description.slice(0, 240),
        amount,
        callback_url: input.callbackUrl,
      }),
    }),
  )

  if (!data.invoice_id) throw new QPayError("QPay invoice үүссэнгүй", 502)

  return {
    invoiceId: data.invoice_id,
    qrText: data.qr_text ?? "",
    qrImage: data.qr_image ?? "",
    shortUrl: data.qPay_shortUrl ?? "",
    urls: Array.isArray(data.urls) ? data.urls : [],
  }
}

export async function checkQPayInvoice(invoiceId: string): Promise<QPayCheckResult> {
  const data = await withAuth((token) =>
    qpayFetch<{
      count?: number
      paid_amount?: number | string
      rows?: QPayPaymentRow[]
    }>("/v2/payment/check", {
      method: "POST",
      token,
      body: JSON.stringify({
        object_type: "INVOICE",
        object_id: invoiceId,
        offset: { page_number: 1, page_limit: 100 },
      }),
    }),
  )

  return {
    count: Number(data.count ?? 0),
    paidAmount: Number(data.paid_amount ?? 0),
    rows: Array.isArray(data.rows) ? data.rows : [],
  }
}

export async function getQPayPayment(paymentId: string): Promise<{
  paymentId: string
  invoiceId?: string
  status?: string
  amount?: number
}> {
  const data = await withAuth((token) =>
    qpayFetch<{
      payment_id?: string
      payment_status?: string
      payment_amount?: string | number
      object_id?: string
    }>(`/v2/payment/${encodeURIComponent(paymentId)}`, { token }),
  )
  return {
    paymentId: data.payment_id ?? paymentId,
    invoiceId: data.object_id,
    status: data.payment_status,
    amount: data.payment_amount != null ? Number(data.payment_amount) : undefined,
  }
}

export function isInvoicePaid(check: QPayCheckResult, expectedAmount?: number): boolean {
  if (check.count <= 0 || check.rows.length === 0) return false
  const paidRows = check.rows.filter((row) => String(row.payment_status ?? "").toUpperCase() === "PAID")
  if (paidRows.length === 0 && check.paidAmount <= 0) return false
  if (expectedAmount && expectedAmount > 0 && check.paidAmount + 0.01 < expectedAmount) {
    return paidRows.length > 0 && check.paidAmount > 0
  }
  return check.paidAmount > 0 || paidRows.length > 0
}
