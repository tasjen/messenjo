/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useEffect,
} from "react";
import { User, Message, Contact, GroupContact, Action } from "@/lib/schema";
import { useParams } from "next/navigation";

type State = {
  user: User;
  contacts: Contact[];
  isWsDisconnected: boolean;
  isClient: boolean;
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
      type: "LOAD_LATEST_MESSAGES";
      payload: {
        groupId: string;
        messages: Message[];
      };
    }
  | {
      type: "LOAD_OLDER_MESSAGES";
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
    }
  | {
      type: "SET_IS_CLIENT";
      payload: boolean;
    };

const initState: State = {
  user: {} as User,
  contacts: [],
  isWsDisconnected: false,
  isClient: false,
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
    case "LOAD_LATEST_MESSAGES":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          // only load messages if not already
          contact.groupId !== payload.groupId || contact.latestMessagesLoaded
            ? contact
            : {
                ...contact,
                messages: payload.messages,
                latestMessagesLoaded: true,
              }
        ),
      };
    case "LOAD_OLDER_MESSAGES":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.groupId !== payload.groupId || contact.allMessagesLoaded
            ? contact
            : {
                ...contact,
                messages: [...contact.messages, ...payload.messages],
                allMessagesLoaded: !payload.messages.length,
              }
        ),
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          // only add a message if the message is not already added
          // by checking username and sentAt field since one user cannot (?)
          // send more than one messages with the same sentAt value
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
                      : contact.messages.toSpliced(1, 0, payload.message),
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
    case "SET_IS_CLIENT":
      return { ...state, isClient: payload };
  }
}

type TStore = {
  user: User;
  contacts: Contact[];
  isWsDisconnected: boolean;
  isClient: boolean;
  setUser: (user: User) => void;
  setGroup: (group: GroupContact) => void;
  loadContacts: (contacts: Contact[]) => void;
  loadLatestMessages: (messages: Message[]) => void;
  loadOlderMessages: (messages: Message[]) => void;
  addMessage: (groupId: string, message: Message) => void;
  resetUnreadCount: () => void;
  addContact: (contact: Contact) => void;
  connectWs: () => void;
  disConnectWs: () => void;
};

const StoreContext = createContext<TStore | null>(null);

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initState);
  const params = useParams<{ groupId: string }>();

  useEffect(() => {
    dispatch({ type: "SET_IS_CLIENT", payload: true });
  }, []);

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

  function loadLatestMessages(messages: Message[]): void {
    dispatch({
      type: "LOAD_LATEST_MESSAGES",
      payload: { groupId: params.groupId, messages },
    });
  }

  function loadOlderMessages(messages: Message[]): void {
    dispatch({
      type: "LOAD_OLDER_MESSAGES",
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
        loadLatestMessages,
        loadOlderMessages,
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
