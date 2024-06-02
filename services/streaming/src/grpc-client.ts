import path from "path";
import { credentials, loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import { ProtoGrpcType as AuthProtoGrpcType } from "../auth_proto/authService";
import { ProtoGrpcType as ChatProtoGrpcType } from "../chat_proto/chatService";
import { newDeadline } from "./utils";

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

export async function verifyUser(token: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    authClient.VerifyToken(
      { token },
      { deadline: newDeadline(5) },
      (err?, res?) => {
        if (err) {
          return reject(err);
        }
        if (!res?.userId) {
          return reject(new Error("no response from auth service"));
        }
        resolve(uuidStringify(res.userId));
      }
    );
  });
}

export async function getGroupIds(userId: string): Promise<string[]> {
  console.log("getting groupIdddddddddddddddddd");
  return await new Promise((resolve, reject) => {
    chatClient.GetGroupIds(
      { userId: uuidParse(userId) },
      { deadline: newDeadline(5) },
      (err?, res?) => {
        if (err) {
          return reject(err);
        }
        if (!res?.groupIds) {
          return resolve([]);
        }
        resolve(res.groupIds.map((e) => uuidStringify(e)));
      }
    );
  });
}
