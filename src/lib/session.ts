import { cookies } from "next/headers"
import { adminAuth, SESSION_COOKIE } from "./firebase/admin"

export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    return await adminAuth().verifySessionCookie(token, true)
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}
