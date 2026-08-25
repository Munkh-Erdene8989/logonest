import { NextResponse } from "next/server"
import { adminAuth, SESSION_COOKIE, SESSION_EXPIRES_MS } from "@/lib/firebase/admin"

export async function POST(req: Request) {
  const { idToken } = (await req.json()) as { idToken?: string }
  if (!idToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }
  try {
    const sessionCookie = await adminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRES_MS,
    })
    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRES_MS / 1000,
      path: "/",
    })
    return res
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" })
  return res
}
