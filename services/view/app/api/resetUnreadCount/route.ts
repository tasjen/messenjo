import { chatClient } from "@/lib/grpc-clients/chat";
import { parse as uuidParse } from "uuid";
import { toHandledError } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("userId");
    if (!userId) throw new Error("no 'userId'");

    const groupId = new URL(req.url).searchParams.get("groupId");
    if (!groupId) throw new Error("no 'groupId' searchParam");

    await chatClient.resetUnreadCount(
      {
        groupId: uuidParse(groupId),
        userId: uuidParse(userId),
      },
      { timeoutMs: 5000 }
    );
  } catch (err) {
    toHandledError(err);
  }
  return new Response();
}
