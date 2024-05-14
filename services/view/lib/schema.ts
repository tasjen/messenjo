import { z } from "zod";

export const Timestamp = z.object({
  seconds: z.number(),
  nanos: z.number(),
});

export const User = z.object({
  id: z.string(),
  username: z.string(),
});

export const Message = z.object({
  id: z.number(),
  fromUsername: z.string(),
  content: z.string(),
  sentAt: z.number(),
});

export const Contact = z.object({
  type: z.union([z.literal("friend"), z.literal("group")]),
  groupId: z.string(),
  name: z.string(),
  // messages: z.array(Message),
  lastMessage: Message.optional(),
  // lastMessageId: z.number(),
  // lastContent: z.string(),
  // lastSentAt: z.number(),
});

export const ChatRoom = z.object({
  groupId: z.string(),
  messages: z.array(Message),
});

export const Action = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("SEND_MESSAGE"),
    payload: z.object({
      groupId: z.string(),
      message: z.object({
        id: z.number(),
        fromUsername: z.string(),
        content: z.string(),
        sentAt: z.number(),
      }),
    }),
  }),
  z.object({
    type: z.literal("ADD_ROOM"),
    payload: z.object({
      type: z.union([z.literal("friend"), z.literal("group")]),
      groupId: z.string(),
      name: z.string(),
      userId: z.string(),
    }),
  }),
]);

export type Timestamp = z.infer<typeof Timestamp>;
export type User = z.infer<typeof User>;
export type Message = z.infer<typeof Message>;
export type Contact = z.infer<typeof Contact>;
export type ChatRoom = z.infer<typeof ChatRoom>;
export type Action = z.infer<typeof Action>;
