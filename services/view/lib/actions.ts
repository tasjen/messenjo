"use server";

import { ServiceError } from "@grpc/grpc-js";
import { chatClient } from "./grpc-client";
import { session, toUuidFormat } from "./utils";
import { headers } from "next/headers";
import { parse } from "uuid";

export type Message = {
  user_id: string;
  group_id: string;
  date: string;
};

export type State = {
  error?: string | null;
};

export async function addFriend(toUserId: string) {
  const fromUserId = session(headers());
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  console.log("fromUserId:", fromUserId);
  console.log("toUserId:", toUserId);
  try {
    return await new Promise<void>((resolve, reject) => {
      chatClient.AddFriend(
        {
          fromUserId: fromUserId,
          toUserId: parse(toUuidFormat(toUserId)),
        },
        { deadline },
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
