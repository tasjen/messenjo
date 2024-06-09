/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, ReactNode, useReducer } from "react";
import { User, Message, Contact, GroupContact, Action } from "@/lib/schema";

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
          contact.groupId !== payload.groupId || contact.messagesLoaded
            ? contact
            : { ...contact, messages: payload.messages, messagesLoaded: true }
        ),
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        contacts: state.contacts.map((contacts) =>
          contacts.groupId !== payload.groupId ||
          contacts.messages.find((m) => m.id === payload.message.id)
            ? contacts
            : {
                ...contacts,
                messages: [payload.message, ...contacts.messages],
              }
        ),
      };
    case "ADD_CONTACT":
      return {
        ...state,
        contacts: state.contacts.find(
          (contact) => contact.groupId === payload.groupId
        )
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
  loadContacts: (c: Contact[]) => void;
  loadMessages: (groupId: string, message: Message[]) => void;
  addMessage: (groupId: string, message: Message) => void;
  addContact: (contact: Contact) => void;
  isWsDisconnected: boolean;
  connectWs: () => void;
  disConnectWs: () => void;
};

const StoreContext = createContext<TStore | null>(null);

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initState);

  function setUser(user: User): void {
    dispatch({ type: "SET_USER", payload: user });
  }

  function setGroup(group: GroupContact): void {
    dispatch({ type: "SET_GROUP", payload: group });
  }

  function loadContacts(contacts: Contact[]): void {
    if (state.contacts.length !== 0) {
      return;
    }
    dispatch({ type: "LOAD_CONTACTS", payload: contacts });
  }

  function loadMessages(groupId: string, messages: Message[]): void {
    dispatch({ type: "LOAD_MESSAGES", payload: { groupId, messages } });
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
        setUser,
        setGroup,
        loadContacts,
        loadMessages,
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
