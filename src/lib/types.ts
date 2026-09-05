export type Product = {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  image: string
  basePrice: number
  unit: string
  popular?: boolean
  features: string[]
}

export type PricingMaterial = {
  id: string
  name: string
  pricePerM2: number
}

export type PricingType = {
  id: string
  name: string
  description: string
  mode: "area" | "unit"
  productId?: string
  basePricePerM2?: number
  basePricePerUnit?: number
  materials?: PricingMaterial[]
  finishes: { id: string; name: string; multiplier: number }[]
}

export type OrderStatus =
  | "received"
  | "design"
  | "printing"
  | "ready"
  | "delivered"

export type OrderEvent = {
  status: OrderStatus
  at: string
  note?: string
}

export type PaymentStatus = "unpaid" | "paid" | "failed"

export type OrderPaymentUrl = {
  name: string
  description: string
  logo: string
  link: string
}

export type OrderPayment = {
  status: PaymentStatus
  invoiceId?: string
  qrImage?: string
  shortUrl?: string
  urls?: OrderPaymentUrl[]
  paymentId?: string
  paidAt?: string
  paidAmount?: number
  error?: string
}

export type Order = {
  code: string
  createdAt: string
  status: OrderStatus
  productName: string
  spec: string
  quantity: number
  total: number
  customer: {
    name: string
    phone: string
    email: string
    note?: string
  }
  fileName?: string
  fileUrl?: string
  timeline: OrderEvent[]
  phoneNormalized: string
  emailLower: string
  qpayInvoiceId?: string
  payment?: OrderPayment
}

export type Message = {
  id: string
  createdAt: string
  name: string
  phone: string
  email: string
  body: string
  read: boolean
}

export type NewsItem = {
  id: string
  title: string
  date: string
  excerpt: string
  tag: string
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Хүлээн авсан",
  design: "Дизайн",
  printing: "Хэвлэлт",
  ready: "Бэлэн болсон",
  delivered: "Хүргэсэн",
}

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  unpaid: "Төлөгдөөгүй",
  paid: "Төлсөн",
  failed: "Төлбөрийн алдаа",
}

export const STATUS_ORDER: OrderStatus[] = [
  "received",
  "design",
  "printing",
  "ready",
  "delivered",
]
