import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import verifyUser from "./lib/auth";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    try {
      const user = await verifyUser(req);

      const headers = new Headers(req.headers);
      headers.set("user", JSON.stringify(user));

      const res = NextResponse.next({ request: { headers } });
      res.cookies.delete("oauthstate");
      return res;
    } catch (err) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}
