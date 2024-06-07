import path from "path";
import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { ProtoGrpcType as ChatProtoGrpcType } from "@/lib/chat_proto/chatService";
import { newDeadline } from "@/lib/utils";
import type { ChatClient } from "@/lib/chat_proto/Chat";
import { AddFriendReq } from "@/lib/chat_proto/AddFriendReq";
import { GetUserByUsernameReq } from "@/lib/chat_proto/GetUserByUsernameReq";
import { GetUserByIdReq } from "@/lib/chat_proto/GetUserByIdReq";
import { GetContactsReq } from "@/lib/chat_proto/GetContactsReq";
import { GetMessagesReq } from "@/lib/chat_proto/GetMessagesReq";
import { CreateGroupReq } from "@/lib/chat_proto/CreateGroupReq";
import { AddMembersReq } from "@/lib/chat_proto/AddMembersReq";
import { SendMessageReq } from "@/lib/chat_proto/SendMessageReq";
import { UpdateUserReq } from "../chat_proto/UpdateUserReq";
import { UpdateGroupReq } from "../chat_proto/UpdateGroupReq";

const packageDefinition = loadSync(
  path.join(process.cwd(), "/lib/chat_proto/chat.proto"),
  {}
);

const { Chat } = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ChatProtoGrpcType;

const chatClient = new Chat("chat:3000", grpc.credentials.createInsecure());

async function getByUsername(
  req: GetUserByUsernameReq
): Promise<Parameters<Parameters<ChatClient["GetUserByUsername"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.GetUserByUsername(
      req,
      { deadline: newDeadline(5) },
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });
}

async function getUserById(
  req: GetUserByIdReq
): Promise<Parameters<Parameters<ChatClient["GetUserById"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.GetUserById(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

async function getContacts(
  req: GetContactsReq
): Promise<Parameters<Parameters<ChatClient["GetContacts"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.GetContacts(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

async function getMessages(
  req: GetMessagesReq
): Promise<Parameters<Parameters<ChatClient["GetMessages"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.GetMessages(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

async function createGroup(
  req: CreateGroupReq
): Promise<Parameters<Parameters<ChatClient["CreateGroup"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.CreateGroup(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

async function updateUser(
  req: UpdateUserReq
): Promise<Parameters<Parameters<ChatClient["UpdateUser"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.UpdateUser(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

async function updateGroup(
  req: UpdateGroupReq
): Promise<Parameters<Parameters<ChatClient["UpdateGroup"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.UpdateGroup(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

async function addFriend(
  req: AddFriendReq
): Promise<Parameters<Parameters<ChatClient["AddFriend"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.AddFriend(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

async function addMembers(
  req: AddMembersReq
): Promise<Parameters<Parameters<ChatClient["AddMembers"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.AddMembers(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

async function sendMessage(
  req: SendMessageReq
): Promise<Parameters<Parameters<ChatClient["SendMessage"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.SendMessage(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });
}

const promisifiedChatClient = {
  getByUsername,
  getUserById,
  getContacts,
  getMessages,
  updateUser,
  updateGroup,
  createGroup,
  addFriend,
  addMembers,
  sendMessage,
};

export default promisifiedChatClient;
