"use server";

import { getUserId } from "@/lib/data";
import { z } from "zod";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import { toHandledError } from "./utils";
import { chatClient } from "./grpc-clients/chat";

export async function updateUser(username: string, pfp: string): Promise<void> {
  try {
    const userId = uuidParse(getUserId());
    await chatClient.updateUser({ userId, username, pfp });
  } catch (err) {
    throw toHandledError(err);
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
    throw toHandledError(err);
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
    throw toHandledError(err);
  }
}

export async function createGroup(
  name: string,
  pfp: string,
  userIds: string[]
): Promise<string> {
  try {
    userIds.unshift(getUserId());
    const res = await chatClient.createGroup({
      groupName: name,
      pfp,
      userIds: userIds.map((id) => uuidParse(id)),
    });
    return uuidStringify(res.groupId);
  } catch (err) {
    throw toHandledError(err);
  }
}

export async function addMessage(
  groupId: string,
  content: string,
  sentAt: number
): Promise<number> {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  try {
    const res = await chatClient.addMessage({
      userId: uuidParse(getUserId()),
      groupId: uuidParse(groupId),
      content,
      sentAt: {
        seconds: BigInt(Math.floor(sentAt / 1e3)),
        nanos: new Date(sentAt).getMilliseconds() * 1e6,
      },
    });
    return z.number().parse(res?.messageId);
  } catch (err) {
    throw toHandledError(err);
  }
}
