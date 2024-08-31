import { App } from "uWebSockets.js";
import { createClient, RedisClientType } from "redis";
import { authClient } from "./grpc-clients";
import { type UserData, UserManager } from "./user-manager";
import { stringify as uuidStringify } from "uuid";
import cookie from "cookie";
import { Action, GroupIds } from "./schema";
import { logger } from "./logger";

const { PORT, REDIS_URI } = process.env;
if (!PORT || !REDIS_URI) {
  throw new Error("Missing PORT or REDIS_URI env variables.");
}

let subDelay = 1; //second

const app = App();
const userManager = new UserManager();
let redisClient: RedisClientType;

app.ws<UserData>("/", {
  idleTimeout: 0, // cannot be greater than 960s, set this in nginx.conf instead
  sendPingsAutomatically: false,
  maxBackpressure: 1024,
  maxPayloadLength: 512,
  maxLifetime: 0, // cannot be greater than 240m, set this in nginx.conf instead

  upgrade: async (res, req, ctx) => {
    let isAborted = false;
    res.onAborted(() => (isAborted = true));
    const secWebSocketKey = req.getHeader("sec-websocket-key");
    const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
    const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");
    const cookies = cookie.parse(req.getHeader("cookie"));

    try {
      if (!cookies.auth_jwt) {
        throw new Error("no token");
      }
      const { userId } = await authClient.verifyToken({
        token: cookies.auth_jwt,
      });
      if (!userId.length) {
        throw new Error("no `res.userId` returned from verifyToken");
      }
      if (isAborted) {
        throw new Error(
          `client disconnected before upgrading, userId: ${uuidStringify(userId)}`
        );
      }

      res.cork(() => {
        res.upgrade(
          {
            userId: uuidStringify(userId),
          },
          secWebSocketKey,
          secWebSocketProtocol,
          secWebSocketExtensions,
          ctx
        );
      });
    } catch (err) {
      if (err instanceof Error) {
        logger.error(`failed to upgrade: ${err.message}`);
      } else {
        logger.error(`unknown error from 'upgrade': ${err}`);
      }
    }
  },
  open: async (ws) => {
    const { userId } = ws.getUserData();
    let topics: string[];
    try {
      // if the user is already connecting from other devices
      // then get topics from that connection
      const conns = userManager.getUser(userId);
      if (conns) {
        topics = conns[0].getTopics();
      } else {
        const groupIdsJson = await redisClient.get(userId);
        if (!groupIdsJson)
          throw new Error(
            "Couldn't find `groupIds` data from Redis cache. It may already be expired"
          );
        const groupIds = GroupIds.parse(JSON.parse(groupIdsJson));
        topics = groupIds.concat(userId);
      }
      for (const t of topics) {
        ws.subscribe(t);
      }
      userManager.addUser(userId, ws);
      logger.info(
        `userId: ${userId} connected, total user online: ${userManager.getNumUsers()}`
      );
    } catch (err) {
      ws.close();
      if (err instanceof Error) {
        logger.error(`failed to open WebSockets: ${err.message}`);
      } else {
        logger.error(`unknown error from 'open': ${err}`);
      }
    }
  },
  close: (ws) => {
    const { userId } = ws.getUserData();
    userManager.removeUser(userId, ws);
    logger.info(
      `userId: ${userId} disconnected, total user online: ${userManager.getNumUsers()}`
    );
  },
});
app.listen(Number(PORT), (listenSocket) => {
  if (listenSocket) {
    console.log(`Listening to port: ${PORT}`);
    subToRedis();
  } else {
    return console.log(`Failed to listen to port: ${PORT}`);
  }
});

async function subToRedis() {
  await new Promise((resolve) => setTimeout(resolve, subDelay * 1e3));
  redisClient = createClient({ url: REDIS_URI });
  try {
    await redisClient.connect();
    console.log(
      `Connected to redis server on port: ${REDIS_URI?.split(":").slice(-1)[0]}`
    );
    await redisClient.subscribe("main", onAction);
    console.log(`Subscribing to redis channel: "main"`);
    subDelay = 1;
  } catch (err) {
    if (err instanceof Error) {
      console.log(`failed to subscribe to channel "main": ${err.message}`);
    } else {
      console.log(`unknown error from 'subToredis': ${err}`);
    }
    await redisClient.disconnect();
    subDelay *= 3;
    console.log(`retrying in ${subDelay} seconds`);
    subToRedis();
  }
}

function onAction(actionJson: string) {
  const actionObject = JSON.parse(actionJson);
  const { success, data } = Action.safeParse(actionObject);
  if (!success) {
    return logger.error(`failed to parse Action: ${actionJson}`);
  }
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
}
