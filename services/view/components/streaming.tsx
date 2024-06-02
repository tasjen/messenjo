/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { useEffect, useMemo } from "react";
import useWebSocket from "react-use-websocket";
import { z } from "zod";
import { Action } from "@/lib/schema";
import { useStore } from "@/lib/stores/client-store";

export default function Streaming() {
  const store = useStore();
  const wsUrl = useMemo(() => {
    const { protocol, host } = window.location;
    return `${protocol.replace("http", "ws")}//${host}/api/streaming/`;
  }, []);
  const { lastMessage } = useWebSocket(wsUrl, {
    heartbeat: false,
    share: true,
    onOpen: () => store.connectWs(),
    onClose: () => store.disConnectWs(),
    onError: () => store.disConnectWs(),
  });

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
    switch (type) {
      case "ADD_MESSAGE":
        return store.addMessage(payload.groupId, payload.message);
      case "ADD_CONTACT":
        return store.addContact(payload);
    }
  }, [lastMessage]);

  return <></>;
}
