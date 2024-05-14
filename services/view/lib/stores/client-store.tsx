"use client";

import { createContext, useContext, ReactNode, useReducer } from "react";
import { User, Message, Contact, ChatRoom } from "@/lib/schema";

type ClientState = {
  user: User;
  contacts: Contact[];
  chatRooms: ChatRoom[];
};

type ClientAction =
  | {
      type: "LOAD_USER";
      payload: User;
    }
  | {
      type: "LOAD_CONTACTS";
      payload: Contact[];
    }
  | {
      type: "LOAD_MESSAGES";
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
    };

const initClientState: ClientState = {
  user: {} as User,
  contacts: [],
  chatRooms: [],
};

function clientStoreReducer(
  state: ClientState,
  action: ClientAction
): ClientState {
  const { type, payload } = action;
  switch (type) {
    case "LOAD_USER":
      return { ...state, user: payload };
    case "LOAD_CONTACTS":
      return { ...state, contacts: payload };
    case "LOAD_MESSAGES":
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
          room.groupId !== payload.groupId
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
  }
}

type TClientStore = {
  user: User;
  contacts: Contact[];
  chatRooms: ChatRoom[];
  loadUser: (user: User) => void;
  loadContacts: (c: Contact[]) => void;
  loadMessages: (groupId: string, message: Message[]) => void;
  addMessage: (groupId: string, message: Message) => void;
};

const ClientStore = createContext<TClientStore | null>(null);

export default function ClientStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(clientStoreReducer, initClientState);

  function loadUser(user: User) {
    dispatch({ type: "LOAD_USER", payload: user });
  }

  function loadContacts(contacts: Contact[]) {
    dispatch({ type: "LOAD_CONTACTS", payload: contacts });
  }

  function loadMessages(groupId: string, messages: Message[]) {
    dispatch({ type: "LOAD_MESSAGES", payload: { groupId, messages } });
  }

  function addMessage(groupId: string, message: Message) {
    dispatch({ type: "ADD_MESSAGE", payload: { groupId, message } });
  }

  return (
    <ClientStore.Provider
      value={{
        user: state.user,
        contacts: state.contacts,
        chatRooms: state.chatRooms,
        loadUser,
        loadContacts,
        loadMessages,
        addMessage,
      }}
    >
      {children}
    </ClientStore.Provider>
  );
}

function useClientStore() {
  const clientStore = useContext(ClientStore);
  if (!clientStore) {
    throw new Error("invalid usage: no ClientStore provider");
  }

  return clientStore;
}

export { useClientStore };
