"use server";

import { ServiceError } from "@grpc/grpc-js";
import { chatClient } from "./grpc-client";
import { getUserId } from "./data";
// import { parse as uuidParse } from "uuid";
import { uuidParse } from "./utils";

export type State = {
  error?: string | null;
};

export async function addFriend(toUserId: string) {
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  try {
    return await new Promise<void>((resolve, reject) => {
      chatClient.AddFriend(
        {
          fromUserId: uuidParse(getUserId()),
          toUserId: uuidParse(toUserId),
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
