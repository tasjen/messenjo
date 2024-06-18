import { Auth } from "@/lib/gen/auth/auth_connect";
import { Chat } from "@/lib/gen/chat/chat_connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";

// for Next middleware
export const authClient = createPromiseClient(
  Auth,
  createGrpcWebTransport({
    baseUrl: "http://envoy:3000",
  })
);

// for client app
export const chatClient = createPromiseClient(
  Chat,
  createGrpcWebTransport({
    baseUrl: `http://${typeof window !== "undefined" ? window.location.host : ""}/api/grpc-web`,
  })
);
