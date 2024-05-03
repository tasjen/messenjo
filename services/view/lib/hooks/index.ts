import { useQuery } from "@tanstack/react-query";
import { Contact, User } from "../data";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export function useContactsQuery(options = {}) {
  const {
    data: contacts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => {
      console.log("refetch user");
      return Promise.resolve([] as Contact[]);
    },
    ...options,
  });
  return { contacts, error, isLoading };
}

export function useUserQuery(options = {}) {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      console.log("refetch user");
      return Promise.resolve({} as User);
    },
    ...options,
  });
  return { user, error, isLoading };
}

type TContactsContext = {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
};
export const ContactsContext = createContext<TContactsContext | null>(null);

export function useContactsContext() {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error(
      "useContactsContext must be used inside the ContactsContextProvider"
    );
  }
  return context;
}
