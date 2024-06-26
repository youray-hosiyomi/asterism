import { NextRequest, NextResponse } from "next/server";
import { getAuthUserOnServer } from "./api/auth.api";

export async function middleware(request: NextRequest) {
  // ワークスペース
  if (request.nextUrl.pathname.startsWith("/ws")) {
    const user = await getAuthUserOnServer(request);
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  // ログイン
  if (request.nextUrl.pathname == "/login") {
    const user = await getAuthUserOnServer(request);
    if (user) {
      return NextResponse.redirect(new URL("/ws", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/ws/:path*", "/login"],
};
