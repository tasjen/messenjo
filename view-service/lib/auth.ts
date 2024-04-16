import { z } from "zod";
import { NextRequest } from "next/server";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export const User = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type User = z.infer<typeof User>;

export default async function verifyUser(
  cookies: RequestCookies
): Promise<User> {
  const token = cookies.get("auth_jwt")?.value;
  if (!token) {
    throw new Error("Invalid token");
  }
  const res = await fetch(`http://auth:3000/verify?token=${token}`);
  const decodedToken = await res.json();
  return User.parse(decodedToken);
}
