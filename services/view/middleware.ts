import { NextRequest, NextResponse } from "next/server";
import { uuidStringify } from "@/lib/utils";
import authClient from "@/lib/grpc-clients/auth";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== "/login") {
    try {
      const token = req.cookies.get("auth_jwt")?.value;
      if (!token) {
        throw new Error("no token");
      }

      const t0 = performance.now();
      const { userId } = await authClient.verifyToken({ token });
      console.log(req.nextUrl.pathname, performance.now() - t0);
      const headers = new Headers(req.headers);
      headers.set("userId", uuidStringify(userId));

      return NextResponse.next({ request: { headers } });
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
