"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { verifyToken } from "./grpc-client";
import { z, ZodError } from "zod";

const User = z.object({
  id: z.string(),
});

type User = z.infer<typeof User>;

export async function verifyUser(
  cookies: ReadonlyRequestCookies
): Promise<User> {
  const token = cookies.get("auth_jwt")?.value;
  if (!token) {
    redirect("/login");
  }
  try {
    const decodedToken = await verifyToken(token);
    return User.parse(decodedToken);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error("500 Internal server error");
    }
    redirect("/login");
  }
}

export async function logout() {
  cookies().delete("auth_jwt");
  redirect("/login");
}
