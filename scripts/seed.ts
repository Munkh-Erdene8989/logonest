import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { NEWS_ITEMS, PRICING_TYPES, PRODUCTS, demoOrders } from "../src/lib/seed-data"

function loadEnv() {
  const file = resolve(process.cwd(), ".env.local")
  if (!existsSync(file)) return
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnv()

function init() {
  if (getApps().length) return
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is missing in .env.local")
  }
  const sa = JSON.parse(raw) as { private_key: string; client_email: string; project_id?: string }
  sa.private_key = sa.private_key.replace(/\\n/g, "\n")
  initializeApp({
    credential: cert(sa),
    projectId: sa.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

async function main() {
  init()
  const db = getFirestore()
  const auth = getAuth()

  const batch = db.batch()
  for (const p of PRODUCTS) {
    batch.set(db.collection("products").doc(p.id), p)
  }
  for (const t of PRICING_TYPES) {
    batch.set(db.collection("pricing").doc(t.id), t)
  }
  for (const n of NEWS_ITEMS) {
    batch.set(db.collection("news").doc(n.id), n)
  }
  for (const o of demoOrders()) {
    batch.set(db.collection("orders").doc(o.code), o)
  }
  await batch.commit()
  console.log("Seeded products, pricing, news, orders")

  const email = process.env.ADMIN_EMAIL || "admin@logonest.mn"
  const password = process.env.ADMIN_PASSWORD
  if (!password) throw new Error("ADMIN_PASSWORD is missing")

  try {
    await auth.getUserByEmail(email)
    console.log("Admin user already exists:", email)
  } catch {
    await auth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: "LOGONEST Admin",
    })
    console.log("Created admin user:", email)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
