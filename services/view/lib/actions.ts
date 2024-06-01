"use server";

import chatClient from "@/lib/grpc-clients/chat";
import { getUserId } from "@/lib/data";
import { uuidParse } from "@/lib/utils";
import { z } from "zod";
import { redirect } from "next/navigation";
import { isServiceError } from "@/lib/schema";

type FormState = {
  error?: string;
};

export async function setUsername(formData: FormData): Promise<FormState> {
  const username = formData.get("username") as string;

  if (!username || username.length < 1) {
    return { error: "too short" };
  }

  try {
    await chatClient.setUsername({ userId: uuidParse(getUserId()), username });
    return {};
  } catch (err) {
    if (isServiceError(err)) {
      return { error: err.details };
    } else if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "unknown error" };
  }
}

export async function addFriend(toUserId: string): Promise<void> {
  try {
    await chatClient.addFriend({
      fromUserId: uuidParse(getUserId()),
      toUserId: uuidParse(toUserId),
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
    const res = await chatClient.sendMessage({
      userId: uuidParse(getUserId()),
      groupId: uuidParse(toGroupId),
      content: formData.get("content") as string,
      sentAt: {
        seconds: Math.floor(sentAt.getTime() / 1000),
        nanos: sentAt.getMilliseconds() * 1e6,
      },
    });
    return z.number().parse(res?.messageId);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    redirect("/error");
  }
}
