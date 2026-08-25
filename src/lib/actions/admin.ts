"use server"

import { revalidatePath } from "next/cache"
import { adminDb } from "@/lib/firebase/admin"
import { requireAdmin } from "@/lib/session"
import type { NewsItem, OrderStatus, PricingType, Product } from "@/lib/types"

function revalidateAll() {
  revalidatePath("/", "layout")
}

export async function updateOrderStatusAction(
  code: string,
  status: OrderStatus,
  note?: string,
) {
  await requireAdmin()
  const ref = adminDb().collection("orders").doc(code)
  const snap = await ref.get()
  if (!snap.exists) throw new Error("Order not found")
  const timeline = Array.isArray(snap.data()?.timeline) ? snap.data()!.timeline : []
  await ref.update({
    status,
    timeline: [...timeline, { status, at: new Date().toISOString(), note }],
  })
  revalidatePath("/admin")
  revalidatePath("/track")
}

export async function saveProductAction(product: Product) {
  await requireAdmin()
  const id =
    product.id ||
    `${product.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`
  await adminDb()
    .collection("products")
    .doc(id)
    .set({ ...product, id }, { merge: true })
  revalidateAll()
}

export async function deleteProductAction(id: string) {
  await requireAdmin()
  await adminDb().collection("products").doc(id).delete()
  revalidateAll()
}

export async function updatePricingAction(pricing: PricingType[]) {
  await requireAdmin()
  const batch = adminDb().batch()
  for (const p of pricing) {
    batch.set(adminDb().collection("pricing").doc(p.id), p)
  }
  await batch.commit()
  revalidateAll()
}

export async function markMessageReadAction(id: string) {
  await requireAdmin()
  await adminDb().collection("messages").doc(id).update({ read: true })
  revalidatePath("/admin")
}

export async function saveNewsAction(item: NewsItem) {
  await requireAdmin()
  const id = item.id || `n-${Date.now()}`
  await adminDb()
    .collection("news")
    .doc(id)
    .set({ ...item, id }, { merge: true })
  revalidatePath("/news")
  revalidatePath("/admin")
}

export async function deleteNewsAction(id: string) {
  await requireAdmin()
  await adminDb().collection("news").doc(id).delete()
  revalidatePath("/news")
  revalidatePath("/admin")
}
