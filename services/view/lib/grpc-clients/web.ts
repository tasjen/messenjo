import { Auth } from "@/lib/gen/auth/auth_connect";
import { Chat } from "@/lib/gen/chat/chat_connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";

// this runs in server (Next middleware)
export const authClient = createPromiseClient(
  Auth,
  createGrpcWebTransport({
    baseUrl: "http://envoy:3000",
  })
);

// this runs in client
export const chatClient = createPromiseClient(
  Chat,
  createGrpcWebTransport({
    baseUrl:
      typeof window !== "undefined"
        ? `${window.location.origin}/api/grpc-web`
        : "",
  })
);
