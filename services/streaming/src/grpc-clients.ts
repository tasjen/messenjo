import { createPromiseClient } from "@connectrpc/connect";
import { Auth } from "../gen/auth/auth_connect";
import { createGrpcTransport } from "@connectrpc/connect-node";

export const authClient = createPromiseClient(
  Auth,
  createGrpcTransport({
    baseUrl: "http://auth:3001",
    httpVersion: "2",
  })
);
