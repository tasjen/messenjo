import { App } from "uWebSockets.js";
import { createClient } from "redis";
import { getGroupIds, verifyToken } from "./grpc-client";
import { UserManager } from "./user-manager";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import cookie from "cookie";
import { Action } from "./schema";

export type UserData = {
  userId: string;
};

const { PORT, REDIS_URI } = process.env;
if (!PORT || !REDIS_URI) {
  throw new Error("Missing PORT or REDIS_URI env variables.");
}

let delay = 1; //second

const app = App();
const userManager = new UserManager();

app.ws<UserData>("/", {
  idleTimeout: Infinity,
  sendPingsAutomatically: false,
  maxBackpressure: 1024,
  maxPayloadLength: 512,
  maxLifetime: Infinity,

  upgrade: async (res, req, ctx) => {
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
      const verifyTokenRes = await verifyToken({ token: cookies.auth_jwt });
      if (!verifyTokenRes?.userId) {
        throw new Error("no `res.userId` returned from verifyToken");
      }

      const userId = uuidStringify(verifyTokenRes.userId);
      if (isAborted) {
        console.log(`client disconnected before upgrading, userId: ${userId}`);
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
          ctx
        );
      });
    } catch (err) {
      console.error(err);
    }
  },

  open: async (ws) => {
    const { userId } = ws.getUserData();
    try {
      const getGroupIdsRes = await getGroupIds({ userId: uuidParse(userId) });
      if (!getGroupIdsRes?.groupIds) {
        throw new Error("no `res.userId` returned from verifyToken");
      }

      ws.subscribe(userId);
      for (const groupId of getGroupIdsRes.groupIds) {
        ws.subscribe(uuidStringify(groupId));
      }
      userManager.addUser(userId, ws);
    } catch (err) {
      console.error(err);
    }
    userManager.printUsers();
  },

  close: (ws) => {
    const { userId } = ws.getUserData();
    userManager.removeUser(userId, ws);
    console.log(`userId: ${userId} disconnected`);
  },
});

app.listen(Number(PORT), (listenSocket) => {
  if (listenSocket) {
    console.log(`Listening to port: ${PORT}`);
  } else {
    return console.log(`Failed to listen to port: ${PORT}`);
  }
});

async function subToMessageCh() {
  await new Promise((resolve) => setTimeout(resolve, delay * 1e3));
  try {
    const subClient = createClient({ url: REDIS_URI });
    await subClient.connect();
    console.log(
      `Connected to redis server on port: ${REDIS_URI?.split(":").slice(-1)[0]}`
    );
    await subClient.subscribe("main", (actionJson) => {
      const actionObject = JSON.parse(actionJson);
      const { success, data } = Action.safeParse(actionObject);
      if (!success) return;
      const { type, payload } = data;
      switch (type) {
        case "ADD_MESSAGE":
          app.publish(payload.toGroupId, actionJson);
          break;
        case "ADD_CONTACT":
          for (const userId of payload.toUserIds) {
            const conns = userManager.getUser(userId) ?? [];
            for (const conn of conns) {
              conn.subscribe(payload.contact.groupId);
            }
            app.publish(userId, actionJson);
          }
          break;
      }
    });
    console.log(`Subscribing to pub/sub channel: "main"`);
  } catch (err) {
    if (err instanceof Error) {
      console.log(`failed to subscribe to channel "main": ${err.message}`);
    } else {
      console.error(err);
    }
    delay *= 3;
    console.log(`retrying in ${delay} seconds`);
    await subToMessageCh();
  }
}

subToMessageCh();
