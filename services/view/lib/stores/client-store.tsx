/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, ReactNode, useReducer } from "react";
import { User, Message, Contact, GroupContact, Action } from "@/lib/schema";
import { useParams } from "next/navigation";

type State = {
  user: User;
  contacts: Contact[];
  isWsDisconnected: boolean;
};

type Action =
  | {
      type: "SET_USER";
      payload: User;
    }
  | {
      type: "SET_GROUP";
      payload: GroupContact;
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
      type: "RESET_UNREAD_COUNT";
      payload: {
        groupId: string;
      };
    }
  | {
      type: "SET_IS_DISCONNECTED";
      payload: boolean;
    };

const initState: State = {
  user: {} as User,
  contacts: [],
  isWsDisconnected: false,
};

function storeReducer(state: State, action: Action): State {
  const { type, payload } = action;
  switch (type) {
    case "SET_USER":
      return { ...state, user: payload };
    case "SET_GROUP":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.groupId !== payload.groupId ? contact : payload
        ),
      };
    case "LOAD_CONTACTS":
      return { ...state, contacts: payload };
    case "LOAD_MESSAGES":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          // only load messages if not already
          contact.groupId !== payload.groupId || contact.messagesLoaded
            ? contact
            : { ...contact, messages: payload.messages, messagesLoaded: true }
        ),
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          // only add a message if the message is not already added
          // by checking username and sentAt field since one user cannot (?)
          // send more than one messages with the same sentAt field
          contact.groupId !== payload.groupId ||
          contact.messages.find(
            (m) =>
              m.fromUsername === payload.message.fromUsername &&
              m.sentAt === payload.message.sentAt
          )
            ? contact
            : {
                ...contact,
                messages:
                  contact.messages.length === 0
                    ? [payload.message]
                    : payload.message.sentAt >= contact.messages[0].sentAt
                      ? [payload.message, ...contact.messages]
                      : [
                          contact.messages[0],
                          payload.message,
                          ...contact.messages.slice(1),
                        ],
                unreadCount:
                  payload.message.fromUsername === state.user.username
                    ? 0
                    : contact.unreadCount + 1,
              }
        ),
      };
    case "RESET_UNREAD_COUNT":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.groupId !== payload.groupId
            ? contact
            : { ...contact, unreadCount: 0 }
        ),
      };
    case "ADD_CONTACT":
      return {
        ...state,
        contacts:
          state.contacts.find(
            (contact) => contact.groupId === payload.groupId
          ) ||
          (payload.type === "friend" && payload.name === state.user.username)
            ? state.contacts
            : [...state.contacts, payload],
      };
    case "SET_IS_DISCONNECTED":
      return { ...state, isWsDisconnected: payload };
  }
}

type TStore = {
  user: User;
  contacts: Contact[];
  setUser: (user: User) => void;
  setGroup: (group: GroupContact) => void;
  loadContacts: (contacts: Contact[]) => void;
  loadMessages: (messages: Message[]) => void;
  addMessage: (groupId: string, message: Message) => void;
  resetUnreadCount: () => void;
  addContact: (contact: Contact) => void;
  isWsDisconnected: boolean;
  connectWs: () => void;
  disConnectWs: () => void;
};

const StoreContext = createContext<TStore | null>(null);

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initState);
  const params = useParams<{ groupId: string }>();

  function setUser(user: User): void {
    dispatch({ type: "SET_USER", payload: user });
  }

  function setGroup(group: GroupContact): void {
    dispatch({ type: "SET_GROUP", payload: group });
  }

  function loadContacts(contacts: Contact[]): void {
    if (state.contacts.length !== 0) return;
    dispatch({ type: "LOAD_CONTACTS", payload: contacts });
  }

  function loadMessages(messages: Message[]): void {
    dispatch({
      type: "LOAD_MESSAGES",
      payload: { groupId: params.groupId, messages },
    });
  }

  function addMessage(groupId: string, message: Message): void {
    dispatch({ type: "ADD_MESSAGE", payload: { groupId, message } });
  }

  function resetUnreadCount(): void {
    dispatch({
      type: "RESET_UNREAD_COUNT",
      payload: { groupId: params.groupId },
    });
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
        setUser,
        setGroup,
        loadContacts,
        loadMessages,
        addMessage,
        resetUnreadCount,
        addContact,
        connectWs,
        disConnectWs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): TStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("invalid usage: no Store provider");
  }

  return store;
}
