"use server";

import { chatClient } from "./grpc-client";
import { getUserId } from "./data";
import { newDeadline, uuidParse } from "./utils";
import { z } from "zod";
import { redirect } from "next/navigation";
import { Timestamp } from "./schema";

type FormState = {
  error?: string;
};

export async function changeUsername(formData: FormData): Promise<FormState> {
  const username = formData.get("username") as string;

  if (!username || username.length < 1) {
    return { error: "too short" };
  }

  try {
    await new Promise<void>((resolve, reject) => {
      chatClient.setUsername(
        { userId: uuidParse(getUserId()), username },
        { deadline: newDeadline(5) },
        (err) => (err ? reject(err.details) : resolve())
      );
    });
    return {};
  } catch (err) {
    if (typeof err === "string") {
      return { error: err };
    } else if (err instanceof Error) {
      return { error: err.message };
    }
  }
  return { error: "unknown error" };
}

export async function addFriend(toUserId: string) {
  try {
    return await new Promise<void>((resolve, reject) => {
      chatClient.AddFriend(
        {
          fromUserId: uuidParse(getUserId()),
          toUserId: uuidParse(toUserId),
        },
        { deadline: newDeadline(5) },
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
}

export async function sendMessage(
  toGroupId: string,
  sentAt: Date,
  formData: FormData
): Promise<number> {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const sentAtTimestamp = Timestamp.parse({
      seconds: Math.floor(sentAt.getTime() / 1000),
      nanos: sentAt.getMilliseconds() * 1e6,
    });
    return await new Promise<number>((resolve, reject) => {
      chatClient.SendMessage(
        {
          userId: uuidParse(getUserId()),
          groupId: uuidParse(toGroupId),
          content: formData.get("content") as string,
          sentAt: sentAtTimestamp,
        },
        { deadline: newDeadline(5) },
        (err, res) => {
          if (err) {
            return reject(err);
          } else if (!res?.messageId) {
            return reject(new Error("no response from SendMessage service"));
          }
          resolve(z.number().parse(res.messageId));
        }
      );
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    redirect("/error");
  }
}
