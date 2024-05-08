import { Contact, User } from "@/lib/schema";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

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
