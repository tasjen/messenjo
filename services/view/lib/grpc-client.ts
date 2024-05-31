import path from "path";
import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { ProtoGrpcType as ChatProtoGrpcType } from "./chat_proto/chatService";
import { newDeadline } from "./utils";
import type { ChatClient } from "./chat_proto/Chat";
import { AddFriendReq } from "./chat_proto/AddFriendReq";
import { SetUsernameReq } from "./chat_proto/SetUsernameReq";
import { GetUserByUsernameReq } from "./chat_proto/GetUserByUsernameReq";
import { GetUserByIdReq } from "./chat_proto/GetUserByIdReq";
import { GetContactsReq } from "./chat_proto/GetContactsReq";
import { GetMessagesReq } from "./chat_proto/GetMessagesReq";
import { CreateGroupReq } from "./chat_proto/CreateGroupReq";
import { AddMemberReq } from "./chat_proto/AddMemberReq";
import { SendMessageReq } from "./chat_proto/SendMessageReq";

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

async function setUsername(
  req: SetUsernameReq
): Promise<Parameters<Parameters<ChatClient["SetUsername"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.SetUsername(req, { deadline: newDeadline(5) }, (err, res) =>
      err ? reject(err.details) : resolve(res)
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

async function addMember(
  req: AddMemberReq
): Promise<Parameters<Parameters<ChatClient["AddMember"]>[1]>[1]> {
  return new Promise((resolve, reject) => {
    chatClient.AddMember(req, { deadline: newDeadline(5) }, (err, res) =>
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
  createGroup,
  setUsername,
  addFriend,
  addMember,
  sendMessage,
};

export default promisifiedChatClient;
