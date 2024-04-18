// import { User } from "@/lib/auth";
// import { VerifyTokenAsync } from "@/lib/auth-connectrpc";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   console.log(`searchParam: ${searchParams}`);
//   const token = searchParams.get("token");
//   console.log(`token: ${token}`);
//   const decodedToken = await VerifyTokenAsync(token!);
//   console.log(`decodedToken: ${decodedToken}`);
//   const user = User.parse(decodedToken);
//   return NextResponse.json({ token });
// }

// export const dynamic = "force-dynamic";
