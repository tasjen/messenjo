"use server";

import { ServiceError } from "@grpc/grpc-js";
import { chatClient } from "./grpc-client";
import { getUserId } from "./data";
import { newDeadline, toDateMs, uuidParse } from "./utils";
import { SendMessageRes } from "./chat_proto/SendMessageRes";
import { z } from "zod";
import { redirect } from "next/navigation";
// import { Timestamp } from "@bufbuild/protobuf";
import { Timestamp } from "./schema";

export type State = {
  error?: string | null;
};

export async function addFriend(toUserId: string) {
  try {
    return await new Promise<void>((resolve, reject) => {
      chatClient.AddFriend(
        {
          fromUserId: uuidParse(getUserId()),
          toUserId: uuidParse(toUserId),
        },
        { deadline: newDeadline(5) },
        (err?: ServiceError | null) => {
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
        (err?: ServiceError | null, res?: SendMessageRes) => {
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
