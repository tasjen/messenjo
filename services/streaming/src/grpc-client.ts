import path from "path";
import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { ProtoGrpcType as AuthProtoGrpcType } from "../auth_proto/authService";
import type { AuthClient } from "../auth_proto/Auth";
import { ProtoGrpcType as ChatProtoGrpcType } from "../chat_proto/chatService";
import { newDeadline } from "./utils";
import { VerifyTokenReq } from "../auth_proto/VerifyTokenReq";
import { GetGroupIdsReq } from "../chat_proto/GetGroupIdsReq";
import { ChatClient } from "../chat_proto/Chat";

const packageDefinition = loadSync(
  [
    path.join(process.cwd(), "./auth_proto/auth.proto"),
    path.join(process.cwd(), "./chat_proto/chat.proto"),
  ],
  {}
);

const { Auth: AuthClient } = loadPackageDefinition(
  packageDefinition
) as unknown as AuthProtoGrpcType;
const { Chat: ChatClient } = loadPackageDefinition(
  packageDefinition
) as unknown as ChatProtoGrpcType;

const authClient = new AuthClient("auth:3001", credentials.createInsecure());
const chatClient = new ChatClient("chat:3000", credentials.createInsecure());

export async function verifyToken(
  req: VerifyTokenReq
): Promise<Parameters<Parameters<AuthClient["VerifyToken"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    authClient.VerifyToken(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

export async function getGroupIds(
  req: GetGroupIdsReq
): Promise<Parameters<Parameters<ChatClient["GetGroupIds"]>[1]>[1]> {
  return await new Promise((resolve, reject) => {
    chatClient.GetGroupIds(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}
