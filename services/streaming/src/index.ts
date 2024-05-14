import { App } from "uWebSockets.js";
import { createClient } from "redis";
import { getGroupIds, verifyUser } from "./grpc-client";
import { UserManager } from "./user-manager";
import { z } from "zod";
// import { getToken } from "./utils";
import cookie from "cookie";

let t0 = Date.now();

export type UserData = {
  userId: string;
  username: string;
};

const { PORT, REDIS_URI } = process.env;
if (!PORT || !REDIS_URI) {
  throw new Error("Missing PORT or REDIS_URI env variables.");
}

const app = App();
const userManager = new UserManager();

app.ws<UserData>("/", {
  idleTimeout: Infinity,
  sendPingsAutomatically: false,
  maxBackpressure: 1024,
  maxPayloadLength: 512,
  maxLifetime: Infinity,

  upgrade: async (res, req, context) => {
    let isAborted = false;
    res.onAborted(() => (isAborted = true));
    const secWebSocketKey = req.getHeader("sec-websocket-key");
    const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
    const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");
    const cookies = cookie.parse(req.getHeader("cookie"));
    if (!cookies.auth_jwt) {
      console.log("no token");
      return;
    }

    try {
      const userId = await verifyUser(cookies.auth_jwt);
      if (isAborted) {
        console.log("client disconnected before upgrading");
        return;
      }

      res.cork(() => {
        res.upgrade(
          {
            userId,
          },
          secWebSocketKey,
          secWebSocketProtocol,
          secWebSocketExtensions,
          context
        );
      });
    } catch (err) {
      console.error(err);
    }
  },

  open: async (ws) => {
    const { userId } = ws.getUserData();
    console.log("user", userId, "connected");

    const groupIds = await getGroupIds(userId);
    for (const id of groupIds) {
      // console.log(`userId: ${userId} is subscribing groupId: ${id}`);
      ws.subscribe(id);
    }
    userManager.addUser(userId, ws);
    userManager.printUsers();
  },

  close: (ws) => {
    const { userId } = ws.getUserData();
    userManager.removeUser(userId, ws);
    console.log(`userId: ${userId} disconnected`);

    const t1 = Date.now();
    console.log("time: ", (t1 - t0) / 1000);
    t0 = t1;
  },

  message: (ws, message, isBynary) => {
    const [toUsername, msg] = new TextDecoder("utf8")
      .decode(message)
      .split("#");
    ws.publish(toUsername, msg, isBynary);

    console.log("message: ", message);
  },
});

app.listen(Number(PORT), async (listenSocket) => {
  if (listenSocket) {
    console.log(`Listening to port: ${PORT}`);
  } else {
    return console.log(`Failed to listen to port: ${PORT}`);
  }

  const subClient = createClient({ url: REDIS_URI });
  await subClient.connect();
  console.log(`Connected to redis server on port: ${REDIS_URI?.slice(-4)}`);

  await subClient.subscribe("main", (actionString) => {
    const actionJson = JSON.parse(actionString);
    const { type, payload } = Action.parse(actionJson);
    switch (type) {
      case "SEND_MESSAGE":
        app.publish(payload.groupId, actionString);
        break;
      case "ADD_ROOM":
        userManager.addRoom(payload.groupId, payload.userId);
        break;
    }
  });
  console.log(`Subscribing to pub/sub channel: "main"`);
});

const SendMessageAction = z.object({
  type: z.literal("SEND_MESSAGE"),
  payload: z.object({
    groupId: z.string(),
    message: z.object({
      id: z.number(),
      fromUsername: z.string(),
      content: z.string(),
      sentAt: z.number(),
    }),
  }),
});

const AddRoomAction = z.object({
  type: z.literal("ADD_ROOM"),
  payload: z.object({
    type: z.union([z.literal("friend"), z.literal("group")]),
    groupId: z.string(),
    name: z.string(),
    userId: z.string(),
  }),
});

const Action = z.discriminatedUnion("type", [SendMessageAction, AddRoomAction]);

type SendMessageAction = z.infer<typeof SendMessageAction>;
type AddRoomAction = z.infer<typeof AddRoomAction>;
type Action = z.infer<typeof Action>;
