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
    const secure = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL)
    res.cookies.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: SESSION_EXPIRES_MS / 1000,
      path: "/",
    })
    return res
  } catch (err) {
    console.error("createSessionCookie failed", err)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL),
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  return res
}
