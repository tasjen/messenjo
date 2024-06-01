/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { toDateFormat } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NoSSR from "@/components/no-ssr";
import { Contact, User } from "@/lib/schema";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/stores/client-store";
import { isToday, isYesterday } from "date-fns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  user: User;
  contacts: Contact[];
};

export default function ContactListClient(props: Props) {
  const pathname = usePathname();
  const store = useStore();
  const [term, setTerm] = useState("");

  useEffect(() => {
    store.setUser(props.user);
    store.setContacts(props.contacts);
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
          .sort(
            (a, b) =>
              Number(b.lastMessage?.sentAt) - Number(a.lastMessage?.sentAt)
          )
          .map((e) => (
            <li
              key={e.groupId}
              className={clsx("p-2 rounded-lg", {
                "bg-[#dddddd] dark:bg-[#333333]":
                  pathname === `/chat/${e.groupId}`,
              })}
            >
              <Link href={`/chat/${e.groupId}`}>
                <div className="flex gap-2">
                  <Avatar className="self-center">
                    <AvatarImage src={e.pfp} alt={`${e.name}'s pfp`} />
                    <AvatarFallback>{e.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex flex-col">
                    <div className="flex">
                      <div className="font-bold text-ellipsis max-w-32 overflow-hidden">
                        {e.name}
                      </div>
                      {e.type === "group" && (
                        <div className="ml-2">({e.memberCount})</div>
                      )}
                      <NoSSR>
                        <div className="ml-auto text-xs self-center">
                          {!e.lastMessage?.sentAt
                            ? "no data"
                            : isToday(e.lastMessage.sentAt)
                              ? toDateFormat(e.lastMessage.sentAt).time
                              : isYesterday(e.lastMessage.sentAt)
                                ? "yesterday"
                                : toDateFormat(e.lastMessage.sentAt).date}
                        </div>
                      </NoSSR>
                    </div>
                    <div className="flex-initial text-sm text-ellipsis overflow-hidden whitespace-nowrap text-ring max-w-48">
                      {e.lastMessage?.content}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
}
