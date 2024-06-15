import { createPromiseClient } from "@connectrpc/connect";
import { Auth } from "../auth_proto/auth_connect";
import { Chat } from "../chat_proto/chat_connect";
import { createGrpcTransport } from "@connectrpc/connect-node";

export const authClient = createPromiseClient(
  Auth,
  createGrpcTransport({
    baseUrl: "http://grpc-gateway:3000",
    httpVersion: "2",
  })
);

export const chatClient = createPromiseClient(
  Chat,
  createGrpcTransport({
    baseUrl: "http://chat:3000",
    httpVersion: "2",
  })
);
