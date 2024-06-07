"use server";

import chatClient from "@/lib/grpc-clients/chat";
import { getUserId } from "@/lib/data";
import { z } from "zod";
import { isServiceError } from "@/lib/schema";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";

export async function updateUser(username: string, pfp: string): Promise<void> {
  try {
    const userId = uuidParse(getUserId());
    await chatClient.updateUser({ userId, username, pfp });
  } catch (err) {
    throw formattedError(err);
  }
}

export async function updateGroup(
  groupId: string,
  name: string,
  pfp: string
): Promise<void> {
  try {
    await chatClient.updateGroup({
      groupId: uuidParse(groupId),
      name,
      pfp,
    });
  } catch (err) {
    throw formattedError(err);
  }
}

export async function addFriend(toUserId: string): Promise<string> {
  try {
    const res = await chatClient.addFriend({
      fromUserId: uuidParse(getUserId()),
      toUserId: uuidParse(toUserId),
    });
    if (!res?.groupId) {
      throw new Error("internal server error: `addFriend`");
    }
    return uuidStringify(res.groupId);
  } catch (err) {
    throw formattedError(err);
  }
}

export async function createGroup(
  name: string,
  pfp: string,
  userIds: string[]
): Promise<string> {
  try {
    const res = await chatClient.createGroup({
      groupName: name,
      pfp,
      userIds: userIds.concat(getUserId()).map((id) => uuidParse(id)),
    });
    if (!res?.groupId) {
      throw new Error("internal server error: `createGroup`");
    }
    return uuidStringify(res.groupId);
  } catch (err) {
    throw formattedError(err);
  }
}

export async function sendMessage(
  groupId: string,
  content: string,
  sentAt: Date
): Promise<number> {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const res = await chatClient.sendMessage({
      userId: uuidParse(getUserId()),
      groupId: uuidParse(groupId),
      content,
      sentAt: {
        seconds: Math.floor(sentAt.getTime() / 1e3),
        nanos: sentAt.getMilliseconds() * 1e6,
      },
    });
    return z.number().parse(res?.messageId);
  } catch (err) {
    throw formattedError(err);
  }
}

function formattedError(err: unknown): Error {
  if (isServiceError(err)) {
    throw new Error(err.details);
  } else if (err instanceof Error) {
    throw err;
  }
  throw new Error("unknown server error");
}
