import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth-client";
export async function proxy(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/order/:id*", "/order", "/seller", "/seller/:id*"],
};
