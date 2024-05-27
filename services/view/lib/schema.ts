import { z } from "zod";

export const Timestamp = z.object({
  seconds: z.number(),
  nanos: z.number(),
});

export const User = z.object({
  id: z.string(),
  username: z.string(),
  pfp: z.string(),
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
  pfp: z.string(),
  memberCount: z.number().optional(),
  lastMessage: Message.optional(),
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
      message: Message,
    }),
  }),
  z.object({
    type: z.literal("ADD_CONTACT"),
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
