import {
  ServiceError,
  credentials,
  loadPackageDefinition,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";
import { ProtoGrpcType } from "./auth_proto/auth";
import { AuthResponse } from "./auth_proto/AuthResponse";

const packageDefinition = loadSync(
  path.join(process.cwd(), "/protos/auth.proto"),
  {}
);

const { Auth: AuthClient } = loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const authClient = new AuthClient("auth:3001", credentials.createInsecure());

export function verifyToken(token: string): Promise<AuthResponse> {
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  return new Promise((resolve, reject) => {
    authClient.VerifyToken(
      { token },
      { deadline },
      (error?: ServiceError | null, res?: AuthResponse) => {
        if (error) {
          console.error(error.details);
          return reject(error);
        }
        resolve({
          providerId: res?.providerId,
          providerName: res?.providerName,
        });
      }
    );
  });
}
