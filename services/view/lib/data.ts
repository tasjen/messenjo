import { ServiceError } from "@grpc/grpc-js";
import { chatClient } from "./grpc-client";
import { GetByUsernameRes } from "./chat_proto/GetByUsernameRes";
import { redirect } from "next/navigation";
import { newDeadline, uuidStringify, uuidParse, toDateMs } from "./utils";
import { GetContactsRes } from "./chat_proto/GetContactsRes";
import { GetMessagesRes } from "./chat_proto/GetMessagesRes";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { GetUserByIdRes } from "./chat_proto/GetUserByIdRes";
import Long from "long";
import { Contact, Message, User, Timestamp } from "@/lib/schema";

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

          resolve(
            res.contacts.map((e) =>
              Contact.parse({
                type: e.type,
                groupId: uuidStringify(e.groupId!),
                name: e.name,
                lastMessageId: e.lastMessageId ?? -1,
                lastContent: e.lastContent ?? "",
                lastSentAt: toDateMs(
                  Timestamp.parse({
                    seconds: (e.lastSentAt?.seconds as Long)?.toNumber() ?? 0,
                    nanos: e.lastSentAt?.nanos ?? 0,
                  })
                ),
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
            res.messages.map((e) => {
              return Message.parse({
                ...e,
                sentAt: toDateMs(
                  Timestamp.parse({
                    seconds: (e.sentAt?.seconds as Long)?.toNumber(),
                    nanos: e.sentAt?.nanos ?? 0,
                  })
                ),
              });
            })
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
