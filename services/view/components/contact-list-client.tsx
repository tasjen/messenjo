/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Contact, User } from "@/lib/schema";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/stores/client-store";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ContactItem from "./contact-item";

type Props = {
  user: User;
  contacts: Contact[];
};

export default function ContactListClient(props: Props) {
  const store = useStore();
  const [term, setTerm] = useState("");

  useEffect(() => {
    store.loadUser(props.user);
    store.loadContacts(props.contacts);
  }, []);

  if (store.isWsDisconnected) {
    return <></>;
  }

  const { contacts } = store.contacts.length ? store : props;

  return (
    <>
      <div className="relative flex items-center gap-2">
        <Search className="absolute pl-2" />
        <Input
          type="search"
          value={term}
          onChange={({ target }) => setTerm(target.value)}
          className="h-7 pl-8 rounded-full"
        />
      </div>
      <ul className="flex flex-col h-full overflow-auto">
        {contacts
          .filter((e) => e.name.toLowerCase().includes(term.toLowerCase()))
          .sort((a, b) => {
            if (a.lastMessage && b.lastMessage) {
              return b.lastMessage.sentAt - a.lastMessage.sentAt;
            } else if (a.lastMessage) {
              return -1;
            } else if (b.lastMessage) {
              return 1;
            } else {
              return a.name.localeCompare(b.name);
            }
          })
          .map((contact) => (
            <ContactItem key={contact.groupId} contact={contact} />
          ))}
      </ul>
    </>
  );
}
