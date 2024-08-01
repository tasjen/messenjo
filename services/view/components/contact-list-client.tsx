/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Contact, User } from "@/lib/schema";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ContactItem from "./contact-item";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {
  user: User;
  contacts: Contact[];
};

export default function ContactListClient(props: Props) {
  const store = useStore();
  const [term, setTerm] = useState("");
  const params = useParams<{ groupId?: string }>();
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    store.setUser(props.user);
    store.loadContacts(props.contacts);
  }, []);

  // Set unload event every time the groupId param changes.
  // For example, if a user navigates to groupId 'A' and closes his tab.
  // 'resetUnreadCount' beacon to the groupId 'A' will be sent. However,
  // if the user navigates to groupId 'A' then navigates to any page that
  // doesn't have groupId param and closes his tab, resetUnreadCount to
  // the groupId 'A' will not be sent as the 'window.onbeforeunload' would
  // already be set to null.
  useEffect(() => {
    window.onbeforeunload = params.groupId
      ? function () {
          navigator.sendBeacon(
            `/api/resetUnreadCount?groupId=${params.groupId}`
          );
        }
      : null;
  }, [params.groupId]);

  const contacts = (
    store.contacts.length || store.isClient ? store : props
  ).contacts
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

  if (store.isWsDisconnected) {
    return (
      <div className="flex flex-col gap-2 items-center my-auto">
        <div>{"You're disconnected"}</div>
        <Button onClick={() => window.location.reload()}>Reconnect</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 my-0">
        <Search className="absolute pl-2" />
        <Input
          type="search"
          value={term}
          onChange={({ target }) => setTerm(target.value)}
          className="h-7 pl-8 rounded-full"
        />
      </div>
      <div className="h-full overflow-auto pr-2 -mr-2">
        {!contacts.length ? (
          <div className="mt-4 text-center">No contacts found</div>
        ) : (
          <ul ref={animationParent}>
            {contacts.map((contact) => (
              <ContactItem key={contact.groupId} contact={contact} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
