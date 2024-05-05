import { ServiceError } from "@grpc/grpc-js";
import { chatClient } from "./grpc-client";
import { GetByUsernameRes } from "./chat_proto/GetByUsernameRes";
import { redirect } from "next/navigation";
import { newDeadline, uuidStringify, uuidParse } from "./utils";
import { GetContactsRes } from "./chat_proto/GetContactsRes";
import { GetMessagesRes } from "./chat_proto/GetMessagesRes";
import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";
import { headers } from "next/headers";
import { GetUserByIdRes } from "./chat_proto/GetUserByIdRes";
import Long from "long";

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

export const FriendContact = z.object({
  type: z.literal("friend"),
  userId: z.string(),
  groupId: z.string(),
  name: z.string(),
  lastContent: z.string(),
  lastSentAt: z.number(),
});
export type FriendContact = z.infer<typeof FriendContact>;

export const GroupContact = z.object({
  type: z.literal("group"),
  groupId: z.string(),
  name: z.string(),
  lastContent: z.string(),
  lastSentAt: z.number(),
});
export type GroupContact = z.infer<typeof GroupContact>;

export const Contact = z.discriminatedUnion("type", [
  FriendContact,
  GroupContact,
]);
export type Contact = z.infer<typeof Contact>;

export function getUserId(): string {
  const userId = headers().get("userId");
  if (!userId) redirect("/login");
  return userId;
}

export async function fetchUserInfo(): Promise<User> {
  noStore();
  // console.log("fetchUserData --------------------");
  try {
    const userId = getUserId();
    return await new Promise((resolve, reject) => {
      chatClient.GetUserById(
        { userId: uuidParse(userId) },
        { deadline: newDeadline(5) },
        (err?: ServiceError | null, res?: GetUserByIdRes) => {
          if (err) {
            return reject(err);
          } else if (!res?.username) {
            return reject(
              new Error("no response from ChatService: `GetUserById`")
            );
          }
          console.log("fetchUserInfo");

          resolve(User.parse({ id: userId, username: res.username }));
        }
      );
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("fetchUserData error: ", err.message);
    } else {
      console.error("fetchUserData unknown error");
    }
    redirect("/error");
  }
}

export async function fetchUserByUsername(username: string): Promise<User> {
  noStore();
  try {
    return await new Promise((resolve, reject) => {
      chatClient.GetByUsername(
        { username },
        { deadline: newDeadline(5) },
        (err?: ServiceError | null, res?: GetByUsernameRes) => {
          if (err) {
            return reject(err);
          } else if (!res?.userId) {
            return reject(
              new Error("no response from ChatService: `GetByUsername`")
            );
          }
          resolve(User.parse({ id: uuidStringify(res.userId), username }));
        }
      );
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("fetchUserByUsername error: ", err.message);
    }
    redirect("/friends");
  }
}

export async function fetchContacts(): Promise<Contact[]> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    return await new Promise((resolve, reject) => {
      chatClient.GetContacts(
        { userId: uuidParse(getUserId()) },
        { deadline: newDeadline(5) },
        (err?: ServiceError | null, res?: GetContactsRes) => {
          if (err) {
            return reject(err);
          } else if (!res) {
            return reject(new Error("no response from ChatService"));
          } else if (!res.contacts) {
            return resolve([]);
          }
          console.log("fetchContacts");

          resolve(
            res.contacts.map((e) =>
              e.type === "friend"
                ? FriendContact.parse({
                    type: e.type,
                    userId: uuidStringify(e.userId!),
                    groupId: uuidStringify(e.groupId!),
                    name: e.name,
                    lastContent: e.lastContent ?? "",
                    lastSentAt: (e.lastSentAt as Long)?.toNumber() ?? 0,
                  })
                : GroupContact.parse({
                    type: e.type,
                    groupId: uuidStringify(e.groupId!),
                    name: e.name,
                    lastContent: e.lastContent ?? "",
                    lastSentAt: (e.lastSentAt as Long)?.toNumber() ?? 0,
                  })
            )
          );
        }
      );
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("fetchContacts error: ", err.message);
    } else {
      console.error("fetchContacts unknown error");
    }
    redirect("/error");
  }
}

export async function fetchMessages(groupId: string): Promise<Message[]> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    return await new Promise((resolve, reject) => {
      chatClient.GetMessages(
        { userId: uuidParse(getUserId()), groupId: uuidParse(groupId) },
        { deadline: newDeadline(5) },
        (err?: ServiceError | null, res?: GetMessagesRes) => {
          if (err) {
            return reject(err);
          } else if (!res?.messages) {
            return reject(new Error("no response from GetMessages"));
          }
          resolve(
            res.messages.map((e) =>
              Message.parse({
                ...e,
                sentAt: (e.sentAt as Long)?.toNumber(),
              })
            )
          );
        }
      );
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("fetchMessages error: ", err.message);
    } else {
      console.error("fetchMessages unknown error");
    }
    redirect("/error");
  }
}
