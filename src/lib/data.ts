import type { DocumentData } from "firebase-admin/firestore"
import { adminDb } from "./firebase/admin"
import { NEWS_ITEMS, PRICING_TYPES, PRODUCTS } from "./seed-data"
import type { Message, NewsItem, Order, PricingType, Product } from "./types"

function asProduct(id: string, data: DocumentData): Product {
  return {
    id,
    name: String(data.name ?? ""),
    category: String(data.category ?? ""),
    tagline: String(data.tagline ?? ""),
    description: String(data.description ?? ""),
    image: String(data.image ?? ""),
    basePrice: Number(data.basePrice ?? 0),
    unit: String(data.unit ?? "ш"),
    popular: Boolean(data.popular),
    features: Array.isArray(data.features) ? data.features.map(String) : [],
  }
}

function asPricing(id: string, data: DocumentData): PricingType {
  return {
    id,
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    mode: data.mode === "unit" ? "unit" : "area",
    productId: data.productId ? String(data.productId) : undefined,
    basePricePerM2: data.basePricePerM2,
    basePricePerUnit: data.basePricePerUnit,
    materials: Array.isArray(data.materials) ? data.materials : undefined,
    finishes: Array.isArray(data.finishes) ? data.finishes : [],
  }
}

function asOrder(id: string, data: DocumentData): Order {
  return {
    code: id,
    createdAt: String(data.createdAt ?? ""),
    status: data.status,
    productName: String(data.productName ?? ""),
    spec: String(data.spec ?? ""),
    quantity: Number(data.quantity ?? 1),
    total: Number(data.total ?? 0),
    customer: {
      name: String(data.customer?.name ?? ""),
      phone: String(data.customer?.phone ?? ""),
      email: String(data.customer?.email ?? ""),
      note: data.customer?.note,
    },
    fileName: data.fileName,
    fileUrl: data.fileUrl,
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
    phoneNormalized: String(data.phoneNormalized ?? ""),
    emailLower: String(data.emailLower ?? ""),
  }
}

function asNews(id: string, data: DocumentData): NewsItem {
  return {
    id,
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    tag: String(data.tag ?? ""),
  }
}

function asMessage(id: string, data: DocumentData): Message {
  return {
    id,
    createdAt: String(data.createdAt ?? ""),
    name: String(data.name ?? ""),
    phone: String(data.phone ?? ""),
    email: String(data.email ?? ""),
    body: String(data.body ?? ""),
    read: Boolean(data.read),
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const snap = await adminDb().collection("products").get()
    if (snap.empty) return PRODUCTS
    return snap.docs.map((d) => asProduct(d.id, d.data()))
  } catch {
    return PRODUCTS
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const doc = await adminDb().collection("products").doc(id).get()
    if (!doc.exists) return PRODUCTS.find((p) => p.id === id) ?? null
    return asProduct(doc.id, doc.data()!)
  } catch {
    return PRODUCTS.find((p) => p.id === id) ?? null
  }
}

export async function getPricing(): Promise<PricingType[]> {
  const preferred = ["wide", "offset"]
  try {
    const snap = await adminDb().collection("pricing").get()
    if (snap.empty) return PRICING_TYPES
    return snap.docs
      .map((d) => asPricing(d.id, d.data()))
      .sort((a, b) => {
        const ai = preferred.indexOf(a.id)
        const bi = preferred.indexOf(b.id)
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
      })
  } catch {
    return PRICING_TYPES
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const snap = await adminDb().collection("news").orderBy("date", "desc").get()
    if (snap.empty) return NEWS_ITEMS
    return snap.docs.map((d) => asNews(d.id, d.data()))
  } catch {
    return NEWS_ITEMS
  }
}

export async function getOrders(): Promise<Order[]> {
  const snap = await adminDb().collection("orders").orderBy("createdAt", "desc").get()
  return snap.docs.map((d) => asOrder(d.id, d.data()))
}

export async function getMessages(): Promise<Message[]> {
  const snap = await adminDb().collection("messages").orderBy("createdAt", "desc").get()
  return snap.docs.map((d) => asMessage(d.id, d.data()))
}
