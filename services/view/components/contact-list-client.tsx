/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { toDateFormat } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NoSSR from "./no-ssr";
import { Contact, User } from "@/lib/schema";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/stores/client-store";
import { isToday, isYesterday } from "date-fns";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

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
      <ul className="flex flex-col divide-y h-full overflow-auto">
        {contacts
          .filter(
            (e) =>
              e.lastMessage && e.name.toLowerCase().includes(term.toLowerCase())
          )
          .sort((a, b) => b.lastMessage!.sentAt - a.lastMessage!.sentAt)
          .map((e) => {
            const { content, sentAt } = e.lastMessage!;
            const { date, time } = toDateFormat(sentAt);
            return (
              <li
                key={e.groupId}
                className={clsx("p-2", {
                  "bg-secondary": pathname === `/chat/${e.groupId}`,
                })}
              >
                <Link href={`/chat/${e.groupId}`}>
                  <div className="flex">
                    <div className="font-bold text-ellipsis max-w-[60%] overflow-hidden">
                      {e.name} {e.type === "group" && `(${e.memberCount})`}
                    </div>
                    <NoSSR>
                      <div className="ml-auto text-xs self-center">
                        {isToday(sentAt)
                          ? time
                          : isYesterday(sentAt)
                            ? "yesterday"
                            : date}
                      </div>
                    </NoSSR>
                  </div>
                  <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap text-ring">
                    {content}
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </>
  );
}
