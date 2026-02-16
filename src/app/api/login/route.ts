import { NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD || "humbledtrader2026";
const COOKIE_NAME = "site-auth";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.password === SITE_PASSWORD) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, SITE_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
