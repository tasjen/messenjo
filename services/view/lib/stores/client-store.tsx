"use client";

import { createContext, useContext, ReactNode, useReducer } from "react";
import { User, Message, Contact, ChatRoom } from "@/lib/schema";
import { toast } from "sonner";

type State = {
  user: User;
  contacts: Contact[];
  chatRooms: ChatRoom[];
  isWsDisconnected: boolean;
};

type Action =
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
      type: "SET_USERNAME";
      payload: string;
    }
  | {
      type: "ADD_CONTACT";
      payload: Contact;
    }
  | {
      type: "ADD_MESSAGE";
      payload: {
        groupId: string;
        message: Message;
      };
    }
  | {
      type: "SET_IS_DISCONNECTED";
      payload: boolean;
    };

const initState: State = {
  user: {} as User,
  contacts: [],
  chatRooms: [],
  isWsDisconnected: false,
};

function storeReducer(state: State, action: Action): State {
  const { type, payload } = action;
  switch (type) {
    case "LOAD_USER":
      return { ...state, user: payload };
    case "LOAD_CONTACTS":
      return { ...state, contacts: payload };
    case "LOAD_MESSAGES":
      return {
        ...state,
        chatRooms: [...state.chatRooms, payload],
      };
    case "SET_USERNAME":
      return {
        ...state,
        user: {
          ...state.user,
          username: payload,
        },
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
    case "ADD_CONTACT":
      return { ...state, contacts: [...state.contacts, payload] };
    case "SET_IS_DISCONNECTED":
      return { ...state, isWsDisconnected: payload };
  }
}

type TStore = {
  user: User;
  contacts: Contact[];
  chatRooms: ChatRoom[];
  loadUser: (user: User) => void;
  loadContacts: (c: Contact[]) => void;
  loadMessages: (groupId: string, message: Message[]) => void;
  setUsername: (username: string) => void;
  addMessage: (groupId: string, message: Message) => void;
  addContact: (contact: Contact) => void;
  isWsDisconnected: boolean;
  connectWs: () => void;
  disConnectWs: () => void;
};

const StoreContext = createContext<TStore | null>(null);

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initState);

  function loadUser(user: User): void {
    dispatch({ type: "LOAD_USER", payload: user });
  }

  function loadContacts(contacts: Contact[]): void {
    dispatch({ type: "LOAD_CONTACTS", payload: contacts });
  }

  function loadMessages(groupId: string, messages: Message[]): void {
    dispatch({ type: "LOAD_MESSAGES", payload: { groupId, messages } });
  }

  function setUsername(username: string): void {
    dispatch({ type: "SET_USERNAME", payload: username });
  }

  function addMessage(groupId: string, message: Message): void {
    dispatch({ type: "ADD_MESSAGE", payload: { groupId, message } });
  }

  function addContact(contact: Contact): void {
    dispatch({ type: "ADD_CONTACT", payload: contact });
  }

  function connectWs(): void {
    dispatch({ type: "SET_IS_DISCONNECTED", payload: false });
  }

  function disConnectWs(): void {
    dispatch({ type: "SET_IS_DISCONNECTED", payload: true });
  }

  return (
    <StoreContext.Provider
      value={{
        ...state,
        loadUser,
        loadContacts,
        loadMessages,
        setUsername,
        addMessage,
        addContact,
        connectWs,
        disConnectWs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

function useStore(): TStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("invalid usage: no Store provider");
  }

  return store;
}

export { useStore };
