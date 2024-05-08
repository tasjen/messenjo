"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { User, Message, ChatRoom, Contact } from "@/lib/schema";

type ClientState = {
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  contacts?: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[] | undefined>>;
  chatRooms?: ChatRoom[];
  addChatRooms: (...c: ChatRoom[]) => void;
  addMessages: (groupId: string, ...message: Message[]) => void;
};

const ClientStore = createContext<ClientState | null>(null);

const ClientStoreProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [contacts, setContacts] = useState<Contact[]>();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>();

  function addChatRooms(...c: ChatRoom[]) {
    if (!chatRooms) {
      setChatRooms([...c]);
      console.log("no chatRooms, set chatRooms to:", [...c]);
    } else {
      const toAdd = c.filter(
        (e) => !chatRooms.find((room) => room.groupId === e.groupId)
      );
      setChatRooms([...chatRooms, ...toAdd]);
      console.log("added", toAdd.length, "rooms to the chatRooms");
    }
  }
  function addMessages(groupId: string, ...messages: Message[]) {
    console.log("addMessages' chatRooms:", chatRooms);
    if (!chatRooms) {
      return;
    }
    setChatRooms(
      chatRooms.map((e) =>
        e.groupId !== groupId
          ? e
          : {
              ...e,
              messages: [
                ...e.messages,
                ...messages.filter(
                  (m) => !e.messages.find((em) => em.id === m.id)
                ),
              ],
            }
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
        addChatRooms,
        addMessages,
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
