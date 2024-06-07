import chatClient from "@/lib/grpc-clients/chat";
import { redirect } from "next/navigation";
import { toDateMs } from "@/lib/utils";
import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { Contact, Message, User } from "@/lib/schema";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";

export function getUserId(): string {
  const userId = headers().get("userId");
  if (!userId) redirect("/login");
  return userId;
}

export async function fetchUserInfo(): Promise<User> {
  noStore();
  try {
    const userId = getUserId();
    const res = await chatClient.getUserById({ userId: uuidParse(userId) });
    return User.parse({
      id: userId,
      username: res?.username,
      pfp: res?.pfp ?? "",
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

export async function fetchUserByUsername(
  username: string
): Promise<User | null> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const res = await chatClient.getByUsername({ username });
    if (!res?.id) {
      return null;
    }
    return User.parse({ ...res, id: uuidStringify(res.id) });
  } catch (err) {
    if (err instanceof Error) {
      console.error("fetchUserByUsername error: ", err.message);
    }
    redirect("/error");
  }
}

export async function fetchContacts(): Promise<Contact[]> {
  noStore();
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const res = await chatClient.getContacts({
      userId: uuidParse(getUserId()),
    });
    if (!res?.contacts) {
      return [];
    }
    return res.contacts.map((e) =>
      Contact.parse({
        ...e,
        pfp: e.pfp || "",
        groupId: e.groupId && uuidStringify(e.groupId),
        userId: e.userId && uuidStringify(e.userId),
        lastMessage: e.lastMessage
          ? {
              id: e.lastMessage.id,
              content: e.lastMessage.content,
              sentAt: toDateMs({
                seconds: e.lastMessage.sentAt?.seconds?.toNumber() ?? 0,
                nanos: e.lastMessage.sentAt?.nanos ?? 0,
              }),
            }
          : undefined,
      })
    );
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
  try {
    const res = await chatClient.getMessages({
      userId: uuidParse(getUserId()),
      groupId: uuidParse(groupId),
    });
    if (!res?.messages) {
      return [];
    }
    return res.messages.map((e) =>
      Message.parse({
        ...e,
        fromPfp: e.fromPfp ?? "",
        sentAt: toDateMs({
          seconds: e.sentAt?.seconds?.toNumber() ?? 0,
          nanos: e.sentAt?.nanos ?? 0,
        }),
      })
    );
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
