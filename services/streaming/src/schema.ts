import { z } from "zod";

const Message = z.object({
  id: z.number(),
  fromUsername: z.string(),
  fromPfp: z.string(),
  content: z.string(),
  sentAt: z.number(),
});

const FriendContact = z.object({
  type: z.literal("friend"),
  groupId: z.string(),
  userId: z.string(),
  name: z.string(),
  pfp: z.string(),
  lastMessage: Message.omit({ fromPfp: true, fromUsername: true }).optional(),
});

const GroupContact = z
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

const Contact = z.union([FriendContact, GroupContact]);

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
    toUserIds: z.array(z.string()),
    contact: Contact,
  }),
});

export const Action = z.discriminatedUnion("type", [
  AddMessageAction,
  AddContactAction,
]);

export const GroupIds = z.array(z.string());
