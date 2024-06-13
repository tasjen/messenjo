import * as chatClient from "@/lib/grpc-clients/chat";
import { parse as uuidParse } from "uuid";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("userId");
    if (!userId) throw new Error("no 'userId'");

    const groupId = new URL(req.url).searchParams.get("groupId");
    if (!groupId) throw new Error("no 'groupId' searchParam");

    await chatClient.resetUnreadCount({
      groupId: uuidParse(groupId),
      userId: uuidParse(userId),
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(
        `failed to resetUnreadCount from route handler: ${err.toString()}`
      );
    } else {
      console.log(`unknown error from route handler: ${err}`);
    }
  }
  return new Response();
}
