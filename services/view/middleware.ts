import { NextRequest, NextResponse } from "next/server";
import { stringify as uuidStringify } from "uuid";
import authClient from "@/lib/grpc-clients/auth";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== "/login") {
    try {
      const token = req.cookies.get("auth_jwt")?.value;
      if (!token) {
        throw new Error("no token");
      }

      const { userId } = await authClient.verifyToken({ token });
      const headers = new Headers(req.headers);
      headers.set("userId", uuidStringify(userId));
      if (req.cookies.get("new_user")?.value === "") {
        headers.set("new_user", "");
      }

      const res = NextResponse.next({ request: { headers } });
      res.cookies.delete("new_user");
      return res;
    } catch (err) {
      console.log(err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|github.svg|google.svg|__nextjs_original-stack-frame).*)",
};
