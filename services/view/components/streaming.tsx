/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { useEffect, useMemo } from "react";
import useWebSocket from "react-use-websocket";
import { z } from "zod";
import { Action } from "@/lib/schema";
import { useStore } from "@/lib/stores/client-store";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import * as actions from "@/lib/actions";

export default function Streaming() {
  const store = useStore();
  const params = useParams<{ groupId: string }>();

  const wsUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      const { protocol, host } = window.location;
      return `${protocol.replace("http", "ws")}//${host}/api/streaming/`;
    }
    return "";
  }, []);

  const { lastMessage } = useWebSocket(wsUrl, {
    heartbeat: false,
    share: true,
    onOpen: () => store.connectWs(),
    onClose: () => store.disConnectWs(),
    onError: () => store.disConnectWs(),
  });

  useEffect(() => {
    const actionJson = z.string().safeParse(lastMessage?.data);
    if (!actionJson.success) {
      return;
    }
    const actionObject = JSON.parse(actionJson.data);
    const action = Action.safeParse(actionObject);
    if (!action.success) {
      console.error(action.error);
      return;
    }
    const { type, payload } = action.data;
    switch (type) {
      case "ADD_MESSAGE":
        const isReading = payload.toGroupId === params.groupId;
        // if the message is not from the user and the user is reading the chat board
        // then make a resetUnreadCount api call
        if (isReading && payload.message.fromUsername !== store.user.username) {
          actions
            .resetUnreadCount(payload.toGroupId)
            .catch((err) => toast(err.message));
        }
        return store.addMessage(payload.toGroupId, payload.message, isReading);
      case "ADD_CONTACT":
        store.addContact(payload.contact);
        switch (payload.contact.type) {
          case "friend":
            toast(`You are now friends with ${payload.contact.name}`);
            break;
          case "group":
            toast(`You have been added to the group ${payload.contact.name}`);
            break;
        }
    }
  }, [lastMessage]);
  return <></>;
}
