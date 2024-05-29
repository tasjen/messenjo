import { chatClient } from "./grpc-client";
import { redirect } from "next/navigation";
import { newDeadline, uuidStringify, uuidParse, toDateMs } from "./utils";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { Contact, Message, User, Timestamp } from "@/lib/schema";

export function getUserId(): string {
  const userId = headers().get("userId");
  if (!userId) redirect("/login");
  return userId;
}

export async function fetchUserInfo(): Promise<User> {
  noStore();
  try {
    const userId = getUserId();
    return await new Promise((resolve, reject) => {
      chatClient.getUserById(
        { userId: uuidParse(userId) },
        { deadline: newDeadline(5) },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          resolve(
            User.parse({ id: userId, username: res?.username, pfp: res?.pfp })
          );
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
        (err, res) => {
          if (err) {
            return reject(err);
          } else if (!res?.userId) {
            return resolve({} as User);
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
      chatClient.getContacts(
        { userId: uuidParse(getUserId()) },
        { deadline: newDeadline(5) },
        (err, res) => {
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
                userId: e.userId && uuidStringify(e.userId),
                name: e.name,
                pfp: e.pfp ?? "",
                memberCount: e.memberCount,
                lastMessage:
                  e.lastMessageId && e.lastContent && e.lastSentAt
                    ? {
                        id: e.lastMessageId,
                        fromUsername: "",
                        content: e.lastContent,
                        sentAt: toDateMs(
                          Timestamp.parse({
                            seconds: e.lastSentAt.seconds?.toNumber() ?? 0,
                            nanos: e.lastSentAt.nanos ?? 0,
                          })
                        ),
                      }
                    : undefined,
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
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`groupId: ${groupId}`);
  console.log(`userId: ${getUserId()}`);
  try {
    return await new Promise((resolve, reject) => {
      chatClient.GetMessages(
        { userId: uuidParse(getUserId()), groupId: uuidParse(groupId) },
        { deadline: newDeadline(5) },
        (err, res) => {
          if (err) {
            return reject(err);
          } else if (!res?.messages) {
            return resolve([]);
          }
          resolve(
            res.messages.map((e) => {
              return Message.parse({
                ...e,
                sentAt: toDateMs(
                  Timestamp.parse({
                    seconds: e.sentAt?.seconds?.toNumber() ?? 0,
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
      console.log(err);
    } else {
      console.error("fetchMessages unknown error");
    }
    redirect("/error");
  }
}
