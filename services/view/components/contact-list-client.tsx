/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Contact, User } from "@/lib/schema";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/stores/client-store";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ContactItem from "./contact-item";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  user: User;
  contacts: Contact[];
};

export default function ContactListClient(props: Props) {
  const store = useStore();
  const [term, setTerm] = useState("");

  useEffect(() => {
    store.setUser(props.user);
    store.loadContacts(props.contacts);
  }, []);

  if (store.isWsDisconnected) {
    return (
      <div className="flex flex-col gap-2 items-center my-auto">
        <div>{"You're disconnected"}</div>
        <Button onClick={() => window.location.reload()}>Reconnect</Button>
      </div>
    );
  }

  const contacts = (store.contacts.length ? store : props).contacts
    .filter((e) => e.name.toLowerCase().includes(term.toLowerCase()))
    .sort((a, b) => {
      const lastMessageA = a.messages[0];
      const lastMessageB = b.messages[0];
      if (lastMessageA && lastMessageB) {
        return lastMessageB.sentAt - lastMessageA.sentAt;
      } else if (lastMessageA) {
        return -1;
      } else if (lastMessageB) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

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
      <ScrollArea className="flex flex-col h-full pr-4 -mr-2">
        {!contacts.length ? (
          <div className="mt-4 text-center">No contacts found</div>
        ) : (
          contacts.map((contact) => (
            <ContactItem key={contact.groupId} contact={contact} />
          ))
        )}
      </ScrollArea>
    </>
  );
}
