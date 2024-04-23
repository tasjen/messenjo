import { ServiceError } from "@grpc/grpc-js";
import { authClient } from "./grpc-client";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { redirect } from "next/navigation";

export async function verifyToken(
  cookies: ReadonlyRequestCookies
): Promise<void> {
  const token = cookies.get("auth_jwt")?.value;
  if (!token) {
    redirect("/login");
  }

  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);

  try {
    return await new Promise((resolve, reject) => {
      authClient.VerifyToken(
        { token },
        { deadline },
        (err?: ServiceError | null) => {
          if (err) {
            console.error(err.details);
            reject(err);
          }
          resolve();
        }
      );
    });
  } catch {
    redirect("/login");
  }
}
