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
    typeof window !== "undefined"
      ? `${window.location.protocol.replace("http", "ws")}//${window.location.host}/api/streaming/`
      : "",
    {
      heartbeat: false,
      share: true,
      onOpen: () => store.connectWs(),
      onClose: () => store.disConnectWs(),
      onError: () => store.disConnectWs(),
    }
  );

  useEffect(() => {
    const actionString = z.string().safeParse(lastMessage?.data);
    if (!actionString.success) {
      return;
    }
    const actionJson = JSON.parse(actionString.data);
    const action = Action.safeParse(actionJson);
    if (!action.success) {
      console.error(action.error);
      return;
    }
    const { type, payload } = action.data;
    if (type === "SEND_MESSAGE") {
      store.addMessage(payload.groupId, payload.message);
    }
  }, [lastMessage]);

  return <></>;
}
