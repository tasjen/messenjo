import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    const res = NextResponse.next();
    res.cookies.delete("oauthstate");
    return res;
  }
}
