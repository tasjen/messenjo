"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { User, Contact, Message } from "../data";

type ChatRoom = { groupId: string; messages: Message[] };

type ClientState = {
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  contacts?: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[] | undefined>>;
  chatRooms?: ChatRoom[];
  addChatRoom: (c: ChatRoom) => void;
  addMessage: (groupId: string, message: Message) => void;
};

const ClientStore = createContext<ClientState | null>(null);

const ClientStoreProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [contacts, setContacts] = useState<Contact[]>();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>();

  function addChatRoom(c: ChatRoom) {
    if (chatRooms) setChatRooms([...chatRooms, c]);
    else setChatRooms([c]);
  }
  function addMessage(groupId: string, message: Message) {
    setChatRooms(
      chatRooms?.map((e) =>
        e.groupId !== groupId
          ? e
          : { groupId, messages: [...e.messages, message] }
      )
    );
  }

  return (
    <ClientStore.Provider
      value={{
        user,
        setUser,
        contacts,
        setContacts,
        chatRooms,
        addChatRoom,
        addMessage,
      }}
    >
      {children}
    </ClientStore.Provider>
  );
};

function useClientStore() {
  const context = useContext(ClientStore);
  if (!context) {
    throw new Error("no ClientStore provider");
  }

  return context;
  // {
  //   num: context.user!,
  //   setNum: context.setUser,
  //   todos: context.contacts!,
  //   setTodos: context.setContacts,
  // };
}

export { ClientStore, ClientStoreProvider, useClientStore };
