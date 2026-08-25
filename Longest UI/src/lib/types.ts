export type Product = {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  image: string
  basePrice: number // жишиг үнэ (₮)
  unit: string // "ш", "м²" гэх мэт
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
  mode: "area" | "unit" // м² эсвэл ширхэгээр
  basePricePerM2?: number // area горимд
  basePricePerUnit?: number // unit горимд
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
  timeline: OrderEvent[]
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

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Хүлээн авсан",
  design: "Дизайн",
  printing: "Хэвлэлт",
  ready: "Бэлэн болсон",
  delivered: "Хүргэсэн",
}

export const STATUS_ORDER: OrderStatus[] = [
  "received",
  "design",
  "printing",
  "ready",
  "delivered",
]
