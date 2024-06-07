"use server";

import chatClient from "@/lib/grpc-clients/chat";
import { getUserId } from "@/lib/data";
import { z } from "zod";
import { redirect } from "next/navigation";
import { isServiceError } from "@/lib/schema";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";

type FormState = {
  error?: string;
};

export async function updateUser(formData: FormData): Promise<void> {
  const parsedForm = z
    .object({
      username: z.string(),
      pfp: z.string(),
    })
    .safeParse({
      username: formData.get("username"),
      pfp: formData.get("pfp"),
    });

  if (!parsedForm.success) {
    throw new Error("failed to parse formData");
  }

  const { username, pfp } = parsedForm.data;

  try {
    const userId = uuidParse(getUserId());
    await chatClient.updateUser({ userId, username, pfp });
  } catch (err) {
    if (isServiceError(err)) {
      throw new Error(err.details);
    } else if (err instanceof Error) {
      throw err;
    }
    throw new Error("unknown error");
  }
}

export async function updateGroup(formData: FormData): Promise<void> {
  const parsedForm = z
    .object({
      groupId: z.string(),
      groupName: z.string(),
      pfp: z.string(),
    })
    .safeParse({
      groupId: formData.get("group-id"),
      groupName: formData.get("group-name"),
      pfp: formData.get("pfp"),
    });

  if (!parsedForm.success) {
    throw new Error("failed to parse formData");
  }

  const { groupId, groupName, pfp } = parsedForm.data;

  try {
    await chatClient.updateGroup({
      groupId: uuidParse(groupId),
      name: groupName,
      pfp,
    });
  } catch (err) {
    if (isServiceError(err)) {
      throw new Error(err.details);
    } else if (err instanceof Error) {
      throw err;
    }
    throw new Error("unknown error");
  }
}

export async function addFriend(toUserId: string): Promise<string> {
  const res = await chatClient.addFriend({
    fromUserId: uuidParse(getUserId()),
    toUserId: uuidParse(toUserId),
  });
  if (!res?.groupId) {
    throw new Error("internal server error: `addFriend`");
  }
  return uuidStringify(res.groupId);
}

export async function createGroup(formData: FormData): Promise<string> {
  const parsedForm = z
    .object({
      groupName: z.string(),
      pfp: z.string().optional(),
      userIds: z.array(z.string()),
    })
    .safeParse({
      groupName: formData.get("group-name"),
      pfp: formData.get("pfp"),
      userIds: [...formData.getAll("user-ids"), getUserId()],
    });

  if (!parsedForm.success) {
    throw new Error("failed to parse formData");
  }

  try {
    const res = await chatClient.createGroup({
      ...parsedForm.data,
      userIds: parsedForm.data.userIds.map((id) => uuidParse(id)),
    });
    if (!res?.groupId) {
      throw new Error("internal server error: `createGroup`");
    }
    return uuidStringify(res.groupId);
  } catch (err) {
    if (isServiceError(err)) {
      throw new Error(err.details);
    } else if (err instanceof Error) {
      throw err;
    }
    throw new Error("unknown server error");
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
        seconds: Math.floor(sentAt.getTime() / 1e3),
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
