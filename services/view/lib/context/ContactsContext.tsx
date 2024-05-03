"use client";

import { ReactNode, useState } from "react";
import { Contact } from "../data";
import { ContactsContext } from "../hooks";

export default function ContactsContextProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [contacts, setContacts] = useState<Contact[]>([]);
  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      {children}
    </ContactsContext.Provider>
  );
}
