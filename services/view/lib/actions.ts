"use server";

import { getUserId } from "@/lib/data";
import { z } from "zod";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import { toHandledError } from "./utils";
import { chatClient } from "./grpc-clients/node";

export async function updateUser(username: string, pfp: string): Promise<void> {
  try {
    const userId = uuidParse(getUserId());
    await chatClient.updateUser({ userId, username, pfp }, { timeoutMs: 5000 });
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
    await chatClient.updateGroup(
      {
        groupId: uuidParse(groupId),
        name,
        pfp,
      },
      { timeoutMs: 5000 }
    );
  } catch (err) {
    throw toHandledError(err);
  }
}

export async function addFriend(toUserId: string): Promise<string> {
  try {
    const { groupId } = await chatClient.addFriend(
      {
        fromUserId: uuidParse(getUserId()),
        toUserId: uuidParse(toUserId),
      },
      { timeoutMs: 5000 }
    );
    return uuidStringify(groupId);
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
    const { groupId } = await chatClient.createGroup(
      {
        groupName: name,
        pfp,
        userIds: userIds.map((id) => uuidParse(id)),
      },
      { timeoutMs: 5000 }
    );
    return uuidStringify(groupId);
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
    const { messageId } = await chatClient.addMessage(
      {
        userId: uuidParse(getUserId()),
        groupId: uuidParse(groupId),
        content,
        sentAt: {
          seconds: BigInt(Math.floor(sentAt / 1e3)),
          nanos: new Date(sentAt).getMilliseconds() * 1e6,
        },
      },
      { timeoutMs: 5000 }
    );
    return z.number().parse(messageId);
  } catch (err) {
    throw toHandledError(err);
  }
}

export async function resetUnreadCount(groupId: string): Promise<void> {
  try {
    await chatClient.resetUnreadCount(
      {
        groupId: uuidParse(groupId),
        userId: uuidParse(getUserId()),
      },
      { timeoutMs: 5000 }
    );
  } catch (err) {
    throw toHandledError(err);
  }
}
