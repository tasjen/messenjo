"use client";

import { createContext, useContext, ReactNode, useReducer } from "react";
import { User, Message, Contact, ChatRoom } from "@/lib/schema";

type ClientState = {
  user: User;
  contacts: Contact[];
  chatRooms: ChatRoom[];
  isWsDisconnected: boolean;
};

type ClientAction =
  | {
      type: "SET_USER";
      payload: User;
    }
  | {
      type: "SET_CONTACTS";
      payload: Contact[];
    }
  | {
      type: "SET_MESSAGES";
      payload: {
        groupId: string;
        messages: Message[];
      };
    }
  | {
      type: "ADD_MESSAGE";
      payload: {
        groupId: string;
        message: Message;
      };
    }
  | {
      type: "CONNECT_WS";
      payload: null;
    }
  | {
      type: "DISCONNECT_WS";
      payload: null;
    };

const initClientState: ClientState = {
  user: {} as User,
  contacts: [],
  chatRooms: [],
  isWsDisconnected: false,
};

function clientStoreReducer(
  state: ClientState,
  action: ClientAction
): ClientState {
  const { type, payload } = action;
  switch (type) {
    case "SET_USER":
      return { ...state, user: payload };
    case "SET_CONTACTS":
      return { ...state, contacts: payload };
    case "SET_MESSAGES":
      return {
        ...state,
        chatRooms: [
          ...state.chatRooms,
          { groupId: payload.groupId, messages: payload.messages },
        ],
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        chatRooms: state.chatRooms.map((room) =>
          room.groupId !== payload.groupId ||
          room.messages.find((m) => m.id === payload.message.id)
            ? room
            : {
                ...room,
                messages: [payload.message, ...room.messages],
              }
        ),
        contacts: state.contacts.map((contact) =>
          contact.groupId !== payload.groupId
            ? contact
            : {
                ...contact,
                lastMessage: payload.message,
              }
        ),
      };
    case "CONNECT_WS":
      return { ...state, isWsDisconnected: false };
    case "DISCONNECT_WS":
      return { ...state, isWsDisconnected: true };
  }
}

type TClientStore = {
  user: User;
  contacts: Contact[];
  chatRooms: ChatRoom[];
  setUser: (user: User) => void;
  setContacts: (c: Contact[]) => void;
  setMessages: (groupId: string, message: Message[]) => void;
  addMessage: (groupId: string, message: Message) => void;
  isWsDisconnected: boolean;
  connectWs: () => void;
  disConnectWs: () => void;
};

const ClientStore = createContext<TClientStore | null>(null);

export default function ClientStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(clientStoreReducer, initClientState);

  function setUser(user: User) {
    dispatch({ type: "SET_USER", payload: user });
  }

  function setContacts(contacts: Contact[]) {
    dispatch({ type: "SET_CONTACTS", payload: contacts });
  }

  function setMessages(groupId: string, messages: Message[]) {
    dispatch({ type: "SET_MESSAGES", payload: { groupId, messages } });
  }

  function addMessage(groupId: string, message: Message) {
    dispatch({ type: "ADD_MESSAGE", payload: { groupId, message } });
  }

  function connectWs() {
    dispatch({ type: "CONNECT_WS", payload: null });
  }

  function disConnectWs() {
    dispatch({ type: "DISCONNECT_WS", payload: null });
  }

  return (
    <ClientStore.Provider
      value={{
        user: state.user,
        contacts: state.contacts,
        chatRooms: state.chatRooms,
        setUser,
        setContacts,
        setMessages,
        addMessage,
        isWsDisconnected: state.isWsDisconnected,
        connectWs,
        disConnectWs,
      }}
    >
      {children}
    </ClientStore.Provider>
  );
}

function useStore() {
  const clientStore = useContext(ClientStore);
  if (!clientStore) {
    throw new Error("invalid usage: no ClientStore provider");
  }

  return clientStore;
}

export { useStore };
