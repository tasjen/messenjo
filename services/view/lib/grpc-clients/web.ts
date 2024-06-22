import { Chat } from "@/lib/gen/chat/chat_connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { createPromiseClient } from "@connectrpc/connect";

export const chatClient = createPromiseClient(
  Chat,
  createGrpcWebTransport({
    baseUrl:
      typeof window !== "undefined"
        ? `${window.location.origin}/api/grpc-web`
        : "",
  })
);
