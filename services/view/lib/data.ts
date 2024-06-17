import { redirect } from "next/navigation";
import { toHandledError, toDateMs } from "@/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { Contact, Message, User } from "@/lib/schema";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import { chatClient } from "./grpc-clients/chat";

export function getUserId(): string {
  const userId = headers().get("userId");
  if (!userId) redirect("/login");
  return userId;
}

export function isNewUser(): boolean {
  return headers().get("new_user") === "";
}

export async function fetchUserInfo(): Promise<User> {
  noStore();
  try {
    const userId = getUserId();
    const user = await chatClient.getUserById(
      { userId: uuidParse(userId) },
      { timeoutMs: 5000 }
    );
    return User.parse({
      ...user,
      id: userId,
    });
  } catch (err) {
    toHandledError(err);
    redirect("/error");
  }
}

export async function fetchUserByUsername(
  username: string
): Promise<User | null> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const user = await chatClient.getUserByUsername(
      { username },
      { timeoutMs: 5000 }
    );
    if (!user.username) return null;
    return User.parse({ ...user, id: uuidStringify(user.id) });
  } catch (err) {
    toHandledError(err);
    redirect("/error");
  }
}

export async function fetchContacts(): Promise<Contact[]> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const { contacts } = await chatClient.getContacts(
      {
        userId: uuidParse(getUserId()),
      },
      { timeoutMs: 5000 }
    );
    return contacts.map((e) =>
      Contact.parse({
        ...e,
        groupId: e.groupId && uuidStringify(e.groupId),
        userId: e.userId.length && uuidStringify(e.userId),
        messages: e.lastMessage
          ? [
              {
                id: e.lastMessage.id,
                content: e.lastMessage.content,
                sentAt: toDateMs(e.lastMessage.sentAt),
              },
            ]
          : [],
      })
    );
  } catch (err) {
    toHandledError(err);
    redirect("/error");
  }
}

export async function fetchMessages(groupId: string): Promise<Message[]> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    const { messages } = await chatClient.getMessages(
      {
        userId: uuidParse(getUserId()),
        groupId: uuidParse(groupId),
      },
      { timeoutMs: 5000 }
    );
    return messages.map((e) =>
      Message.parse({
        ...e,
        sentAt: toDateMs(e.sentAt),
      })
    );
  } catch (err) {
    toHandledError(err);
    redirect("/error");
  }
}
