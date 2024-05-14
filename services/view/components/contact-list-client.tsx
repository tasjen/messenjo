/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { toDateFormat } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NoSSR from "./no-ssr";
import { Contact, User } from "@/lib/schema";
import { useEffect } from "react";
import { useClientStore } from "@/lib/stores/client-store";

type Props = {
  user: User;
  contacts: Contact[];
};

export default function ContactListClient(props: Props) {
  const pathname = usePathname();
  const store = useClientStore();

  useEffect(() => {
    store.loadUser(props.user);
    store.loadContacts(props.contacts);
  }, []);

  const contacts =
    store.contacts.length !== 0 ? store.contacts : props.contacts;

  return (
    <>
      <ul className="flex flex-col overflow-auto gap-2 h-full">
        {contacts
          .filter((e) => e.lastMessage !== undefined)
          .sort((a, b) => b.lastMessage!.sentAt - a.lastMessage!.sentAt)
          .map((e) => {
            const { content, sentAt } = e.lastMessage!;
            return (
              <li
                key={e.groupId}
                className={clsx("bg-gray-200 rounded-md p-2", {
                  "bg-sky-100": pathname === `/chat/${e.groupId}`,
                })}
              >
                <Link href={`/chat/${e.groupId}`}>
                  <div className="flex">
                    <div className="font-bold text-ellipsis max-w-[60%] overflow-hidden">
                      {e.name}
                    </div>
                    <NoSSR>
                      <div className="ml-auto text-xs self-center">
                        {
                          toDateFormat(sentAt)[
                            sentAt < Date.now() - 24 * 60 * 60 * 1000 ? 0 : 1
                          ]
                        }
                      </div>
                    </NoSSR>
                  </div>
                  <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
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
