import { ServiceError } from "@grpc/grpc-js";
import { chatClient } from "./grpc-client";
import { GetByUsernameRes } from "./chat_proto/GetByUsernameRes";
import { redirect } from "next/navigation";
import { newDeadline } from "./utils";
import { GetContactsRes } from "./chat_proto/GetContactsRes";
import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

const User = z.object({
  id: z.string(),
});
type User = z.infer<typeof User>;

type Message = {
  id: string;
  content: string;
  sent_at: BigInt;
};

export const Contact = z.object({
  groupId: z.string(),
  name: z.string(),
  lastContent: z.string(),
  lastSentAt: z.number(),
});

export type Contact = z.infer<typeof Contact>;

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
            return reject(new Error("no response from ChatService"));
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

export async function fetchContacts(userId: Uint8Array): Promise<Contact[]> {
  noStore();
  try {
    return await new Promise((resolve, reject) => {
      chatClient.GetContacts(
        { userId },
        { deadline: newDeadline(5) },
        (err?: ServiceError | null, res?: GetContactsRes) => {
          if (err) {
            return reject(err);
          } else if (!res?.contacts) {
            return reject(new Error("no response from ChatService"));
          }
          resolve(
            res.contacts.map((e) =>
              Contact.parse({
                groupId: e.groupId?.toString("hex"),
                name: e.name,
                lastContent: e.lastContent ?? "",
                lastSentAt: e.lastSentAt?.toNumber() ?? 0,
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
