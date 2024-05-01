import path from "path";
import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { ProtoGrpcType as ChatProtoGrpcType } from "./chat_proto/chat";

const packageDefinition = loadSync(
  path.join(process.cwd(), "/protos/chat.proto"),
  {}
);

const { Chat: ChatClient } = loadPackageDefinition(
  packageDefinition
) as unknown as ChatProtoGrpcType;

export const chatClient = new ChatClient(
  "chat:3000",
  credentials.createInsecure()
);
