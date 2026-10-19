import { NextResponse } from "next/server";
import { clearAuthCookie, getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  // Fixed destinations prevent open redirects. A valid session is preserved
  // even if this endpoint is opened directly or prefetched.
  const response = NextResponse.redirect(new URL(user ? "/dashboard" : "/login", request.url), { status: 303 });
  response.headers.set("cache-control", "private, no-store");
  return user ? response : clearAuthCookie(response);
}
