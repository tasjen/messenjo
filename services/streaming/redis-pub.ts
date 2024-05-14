import { createClient } from "redis";

const pubClient = createClient({ url: "redis://messagech:6379" });
(async () => {
  await pubClient.connect();
})();

const messageChannel = "main";

pubClient
  .publish(
    messageChannel,
    JSON.stringify({
      type: "SEND_MESSAGE",
      payload: {
        groupId: "f1f0cfb5-fab9-416b-8815-3dbad782db09",
        message: {
          id: Math.random(),
          fromUsername: "username1",
          content: "content1",
          sentAt: Date.now(),
        },
      },
    })
  )
  .then(() => {
    pubClient.disconnect();
  });
