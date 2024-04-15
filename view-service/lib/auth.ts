import { jwtVerify } from "jose";
import env from "./env";
import { z } from "zod";
import { NextRequest } from "next/server";

export const User = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  exp: z.number(),
});

export type User = z.infer<typeof User>;

export default async function verifyUser(req: NextRequest): Promise<User> {
  let token = req.cookies.get("auth_jwt")?.value;
  token = z.string().parse(token);
  const claims = await jwtVerify(
    token,
    new TextEncoder().encode(env.JWT_SECRET)
  );
  return User.parse(claims.payload);
}
