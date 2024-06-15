import { Auth } from "@/lib/auth_proto/auth_connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";

export const authClient = createPromiseClient(
  Auth,
  createGrpcWebTransport({
    baseUrl: "http://grpc-gateway:3000",
  })
);
