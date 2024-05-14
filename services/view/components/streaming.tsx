/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { z } from "zod";
import { Action } from "@/lib/schema";
import { useClientStore } from "@/lib/stores/client-store";

export default function Streaming() {
  const store = useClientStore();
  const { lastMessage } = useWebSocket(
    `ws://${typeof window !== "undefined" ? window.location.host : ""}/api/streaming/`,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 5,
      reconnectInterval: 5,
      heartbeat: false,
      share: true,
    }
  );

  useEffect(() => {
    if (!lastMessage?.data) {
      return;
    }
    try {
      const messageString = z.string().parse(lastMessage.data);
      const messageJson = JSON.parse(messageString);
      const { type, payload } = Action.parse(messageJson);

      if (type === "SEND_MESSAGE") {
        store.addMessage(payload.groupId, payload.message);
      }
    } catch (err) {
      console.error(err);
    }
  }, [lastMessage]);

  return <></>;
}
