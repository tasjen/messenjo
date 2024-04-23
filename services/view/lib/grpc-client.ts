import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import path from "path";
import { ProtoGrpcType } from "./auth_proto/auth";

const packageDefinition = loadSync(
  path.join(process.cwd(), "/protos/auth.proto"),
  {}
);

const { Auth: AuthClient } = loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

export const authClient = new AuthClient(
  "auth:3001",
  credentials.createInsecure()
);
