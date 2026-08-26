"use server"

import { revalidatePath } from "next/cache"
import { adminBucket, adminDb } from "@/lib/firebase/admin"
import { requireAdmin } from "@/lib/session"
import type { NewsItem, OrderStatus, PricingType, Product } from "@/lib/types"

const IMAGE_TYPES = new Set(["image/webp", "image/jpeg", "image/png", "image/jpg"])
const MAX_IMAGE = 5 * 1024 * 1024

function revalidateAll() {
  revalidatePath("/", "layout")
}

function uploadErrorMessage(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  if (/bucket/i.test(msg) && /not exist|does not exist/i.test(msg)) {
    return "Хадгалах сан олдсонгүй. Storage тохиргоог шалгана уу."
  }
  if (/permission|forbidden|403|denied/i.test(msg)) {
    return "Зураг хадгалах эрх хүрэхгүй байна."
  }
  return "Зураг оруулахад алдаа гарлаа."
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

export async function saveProductAction(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin()

  let product: Product
  try {
    product = JSON.parse(String(formData.get("product") ?? "")) as Product
  } catch {
    return { ok: false, error: "Бүтээгдэхүүний мэдээлэл буруу байна." }
  }

  if (!product.name?.trim()) {
    return { ok: false, error: "Нэр оруулна уу." }
  }

  const id =
    product.id ||
    `${product.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

  let image = product.image?.trim() ?? ""
  const imageFile = formData.get("image")

  if (imageFile instanceof File && imageFile.size > 0) {
    if (imageFile.size > MAX_IMAGE) {
      return { ok: false, error: "Зураг 5MB-аас хэтэрч болохгүй." }
    }
    const type = imageFile.type || "image/webp"
    if (!IMAGE_TYPES.has(type)) {
      return { ok: false, error: "Зөвшөөрөгдсөн формат: JPG, PNG, WebP." }
    }
    const ext = type.includes("jpeg") || type.includes("jpg") ? "jpg" : type.includes("png") ? "png" : "webp"
    const path = `products/${id}/cover.${ext}`
    try {
      const bucket = adminBucket()
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const gfile = bucket.file(path)
      await gfile.save(buffer, {
        metadata: { contentType: type },
      })
      const [signed] = await gfile.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 5,
      })
      image = signed
    } catch (err) {
      console.error("Product image upload failed", err)
      return { ok: false, error: uploadErrorMessage(err) }
    }
  }

  if (!image) {
    return { ok: false, error: "Зураг оруулах эсвэл URL бичнэ үү." }
  }

  await adminDb()
    .collection("products")
    .doc(id)
    .set({ ...product, id, image }, { merge: true })
  revalidateAll()
  return { ok: true }
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
