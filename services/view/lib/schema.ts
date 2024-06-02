import { ServiceError } from "@grpc/grpc-js";
import { z } from "zod";

export function isServiceError(err: unknown): err is ServiceError {
  return z.object({ details: z.string() }).safeParse(err).success;
}

export const User = z.object({
  id: z.string(),
  username: z.string(),
  pfp: z.coerce.string(),
});

export const Message = z.object({
  id: z.number(),
  fromUsername: z.string(),
  fromPfp: z.coerce.string(),
  content: z.string(),
  sentAt: z.number(),
});

export const Contact = z.object({
  type: z.union([z.literal("friend"), z.literal("group")]),
  groupId: z.string(),
  userId: z.string().optional(),
  name: z.string(),
  pfp: z.coerce.string(),
  memberCount: z.number().optional(),
  lastMessage: Message.optional(),
});

export const ChatRoom = z.object({
  groupId: z.string(),
  messages: z.array(Message),
});

const AddMessageAction = z.object({
  type: z.literal("ADD_MESSAGE"),
  payload: z.object({
    groupId: z.string(),
    message: Message,
  }),
});

const AddContactAction = z.object({
  type: z.literal("ADD_CONTACT"),
  payload: Contact,
});

export const Action = z.discriminatedUnion("type", [
  AddMessageAction,
  AddContactAction,
]);

export type User = z.infer<typeof User>;
export type Message = z.infer<typeof Message>;
export type Contact = z.infer<typeof Contact>;
export type ChatRoom = z.infer<typeof ChatRoom>;
export type Action = z.infer<typeof Action>;
