import { redirect } from "next/navigation";
import { toDateMs, handleNodeError } from "@/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import { cookies, headers } from "next/headers";
import { Contact, Message, User } from "@/lib/schema";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import { chatClient } from "./grpc-clients/node";
import { Empty } from "@bufbuild/protobuf";
import { MESSAGES_BATCH_SIZE } from "./config";

export function isNewUser(): boolean {
  return headers().get("new_user") === "";
}

export async function fetchUserInfo(): Promise<User> {
  noStore();
  try {
    const user = await chatClient.getUserInfo(new Empty(), {
      headers: { cookie: cookies().toString() },
    });
    return User.parse({
      ...user,
      id: uuidStringify(user.id),
    });
  } catch (err) {
    handleNodeError(err);
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
      {
        headers: { cookie: cookies().toString() },
      }
    );
    if (!user.username) return null;
    return User.parse({ ...user, id: uuidStringify(user.id) });
  } catch (err) {
    handleNodeError(err);
    redirect("/error");
  }
}

export async function fetchContacts(): Promise<Contact[]> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const { contacts } = await chatClient.getContacts(new Empty(), {
      headers: { cookie: cookies().toString() },
    });
    return contacts.map((e) =>
      Contact.parse({
        ...e,
        groupId: e.groupId && uuidStringify(e.groupId),
        userId: e.userId.length && uuidStringify(e.userId),
        messages: e.lastMessage?.id
          ? [
              {
                id: e.lastMessage.id,
                content: e.lastMessage.content,
                sentAt: toDateMs(e.lastMessage.sentAt),
              },
            ]
          : [],
        allMessagesLoaded: !e.lastMessage?.id,
      })
    );
  } catch (err) {
    handleNodeError(err);
    redirect("/error");
  }
}

export async function fetchLatestMessages(groupId: string): Promise<Message[]> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    const { messages } = await chatClient.getMessages(
      {
        groupId: uuidParse(groupId),
        start: 1,
        end: MESSAGES_BATCH_SIZE,
      },
      {
        headers: { cookie: cookies().toString() },
      }
    );
    return messages.map((e) =>
      Message.parse({
        ...e,
        sentAt: toDateMs(e.sentAt),
      })
    );
  } catch (err) {
    handleNodeError(err);
    redirect("/error");
  }
}
