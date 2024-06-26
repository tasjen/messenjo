import { z } from "zod";

export const User = z.object({
  id: z.string(),
  username: z.string(),
  pfp: z.string(),
});

export const Message = z.object({
  id: z.number(),
  fromUsername: z.string().default(""),
  fromPfp: z.string().default(""),
  content: z.string(),
  sentAt: z.number(),
});

export const FriendContact = z.object({
  type: z.literal("friend"),
  groupId: z.string(),
  userId: z.string(),
  name: z.string(),
  pfp: z.string().default(""),
  messages: z.array(Message).default([]),
  unreadCount: z.number().default(0),
  latestMessagesLoaded: z.boolean().default(false),
  allMessagesLoaded: z.boolean().default(false),
});

export const GroupContact = z
  .object({
    type: z.literal("group"),
    memberCount: z.number(),
  })
  .and(
    FriendContact.omit({
      userId: true,
      type: true,
    })
  );

export const Contact = z.union([FriendContact, GroupContact]);

const AddMessageAction = z.object({
  type: z.literal("ADD_MESSAGE"),
  payload: z.object({
    toGroupId: z.string(),
    message: Message,
  }),
});

const AddContactAction = z.object({
  type: z.literal("ADD_CONTACT"),
  payload: z.object({
    contact: Contact,
  }),
});

export const Action = z.discriminatedUnion("type", [
  AddMessageAction,
  AddContactAction,
]);

export type User = z.infer<typeof User>;
export type Message = z.infer<typeof Message>;
export type FriendContact = z.infer<typeof FriendContact>;
export type GroupContact = z.infer<typeof GroupContact>;
export type Contact = z.infer<typeof Contact>;
