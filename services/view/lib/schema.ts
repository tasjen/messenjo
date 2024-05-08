import { z } from "zod";

export const Timestamp = z.object({
  seconds: z.number(),
  nanos: z.number(),
});
export type Timestamp = z.infer<typeof Timestamp>;

export const User = z.object({
  id: z.string(),
  username: z.string(),
});
export type User = z.infer<typeof User>;

export const Message = z.object({
  id: z.number(),
  fromUsername: z.string(),
  content: z.string(),
  sentAt: z.number(),
});
export type Message = z.infer<typeof Message>;

export const Contact = z.object({
  type: z.union([z.literal("friend"), z.literal("group")]),
  groupId: z.string(),
  name: z.string(),
  lastMessageId: z.number(),
  lastContent: z.string(),
  lastSentAt: z.number(),
});
export type Contact = z.infer<typeof Contact>;

export const ChatRoom = z.object({
  groupId: z.string(),
  messages: z.array(Message),
});
export type ChatRoom = z.infer<typeof ChatRoom>;
