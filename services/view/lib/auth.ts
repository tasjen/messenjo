import { ServiceError } from "@grpc/grpc-js";
import { authClient } from "./grpc-client";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { redirect } from "next/navigation";
import { AuthResponse } from "./auth_proto/AuthResponse";

export async function verifyToken(
  cookies: ReadonlyRequestCookies
): Promise<string> {
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
        (err?: ServiceError | null, res?: AuthResponse) => {
          if (err) {
            console.error(err.details);
            return reject(err);
          } else if (!res?.userId) {
            return reject(new Error("no response from AuthService"));
          }
          resolve(res.userId.toString());
        }
      );
    });
  } catch {
    redirect("/login");
  }
}
