import {
  ServiceError,
  credentials,
  loadPackageDefinition,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";
import { ProtoGrpcType } from "./gen/token-verifier";
import { AuthResponse } from "./gen/AuthResponse";

console.log(path.join(process.cwd(), "/protos/token-verifier.proto"));
const packageDefinition = loadSync(
  path.join(process.cwd(), "/protos/token-verifier.proto"),
  {}
);

const { TokenVerifier } = loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const client = new TokenVerifier("auth:3001", credentials.createInsecure());

export function verifyToken(token: string): Promise<AuthResponse> {
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  return new Promise((resolve, reject) => {
    client.VerifyToken(
      { token },
      { deadline },
      (error?: ServiceError | null, res?: AuthResponse) => {
        if (error) {
          return reject(error);
        }
        resolve({
          id: res?.id,
          name: res?.name,
        });
      }
    );
  });
}
