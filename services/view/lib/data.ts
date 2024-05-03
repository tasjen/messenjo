import { ServiceError } from "@grpc/grpc-js";
import { chatClient } from "./grpc-client";
import { GetByUsernameRes } from "./chat_proto/GetByUsernameRes";
import { redirect } from "next/navigation";
import { newDeadline, uuidStringify, uuidParse } from "./utils";
import { GetContactsRes } from "./chat_proto/GetContactsRes";
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

export type Message = {
  id: number;
  fromUsername: string;
  content: string;
  sentAt: number;
};

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

export async function fetchUserData(): Promise<User> {
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
          console.log(res.username);
          resolve(User.parse({ id: userId, username: res.username }));
        }
      );
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("fetchContacts unknown error");
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
          resolve(User.parse({ id: res.userId.toString("hex") }));
        }
      );
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    redirect("/friends");
  }
}

export async function fetchContacts(): Promise<Contact[]> {
  noStore();
  // console.log("fetchContacts --------------------");
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    return await new Promise((resolve, reject) => {
      chatClient.GetContacts(
        { userId: uuidParse(getUserId()) },
        { deadline: newDeadline(5) },
        (err?: ServiceError | null, res?: GetContactsRes) => {
          if (err) {
            return reject(err);
          } else if (!res?.contacts) {
            return reject(new Error("no response from ChatService"));
          }
          resolve(
            res.contacts.map((e) =>
              e.type === "friend"
                ? FriendContact.parse({
                    type: e.type,
                    userId: uuidStringify(
                      z.instanceof(Uint8Array).parse(e.userId)
                    ),
                    groupId: uuidStringify(
                      z.instanceof(Uint8Array).parse(e.groupId)
                    ),
                    name: e.name,
                    lastContent: e.lastContent ?? "",
                    lastSentAt: (e.lastSentAt as Long)?.toNumber() ?? 0,
                  })
                : GroupContact.parse({
                    type: e.type,
                    groupId: uuidStringify(
                      z.instanceof(Uint8Array).parse(e.groupId)
                    ),
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
      console.error(err.message);
    } else {
      console.error("fetchContacts unknown error");
    }
    redirect("/error");
  }
}

export async function fetchMessages(): Promise<Message[]> {
  noStore();
  return [
    {
      id: 1,
      fromUsername: "one",
      content: "from one 1",
      sentAt: 1714599407051,
    },
    {
      id: 2,
      fromUsername: "github#129994991",
      content: "from github 1",
      sentAt: 1714599307051,
    },
    {
      id: 3,
      fromUsername: "github#129994991",
      content: "from github 2",
      sentAt: 1714599207051,
    },
    {
      id: 4,
      fromUsername: "one",
      content: "from one 2",
      sentAt: 1714599107051,
    },
  ];
}
