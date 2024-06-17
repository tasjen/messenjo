import { Chat } from "@/lib/gen/chat/chat_connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { createPromiseClient } from "@connectrpc/connect";

export const chatClient = createPromiseClient(
  Chat,
  createGrpcTransport({
    baseUrl: "http://chat:3000",
    httpVersion: "2",
  })
);
