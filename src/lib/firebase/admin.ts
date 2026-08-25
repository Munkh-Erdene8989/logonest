import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

function getAdminApp(): App {
  const existing = getApps()[0]
  if (existing) return existing

  const bucket =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (raw) {
    const parsed = JSON.parse(raw) as {
      project_id?: string
      client_email: string
      private_key: string
    }
    return initializeApp({
      credential: cert({
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key.replace(/\\n/g, "\n"),
      }),
      storageBucket: bucket,
      projectId: parsed.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  }

  return initializeApp({
    storageBucket: bucket,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
}

export function adminDb() {
  return getFirestore(getAdminApp())
}

export function adminAuth() {
  return getAuth(getAdminApp())
}

export function adminBucket() {
  return getStorage(getAdminApp()).bucket()
}

export const SESSION_COOKIE = "lg_session"
export const SESSION_EXPIRES_MS = 60 * 60 * 24 * 5 * 1000
