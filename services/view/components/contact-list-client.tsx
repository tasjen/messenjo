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
  console.log("loaded home layout");

  useEffect(() => {
    store.setUser(props.user);
    store.setContacts(props.contacts);
  }, []);

  return (
    <ul className="flex flex-col gap-2 h-full">
      {(store.contacts ?? props.contacts)
        ?.filter((e) => e.lastContent !== "")
        .sort((a, b) => b.lastSentAt - a.lastSentAt)
        .map((e) => (
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
                      toDateFormat(e.lastSentAt)[
                        e.lastSentAt < Date.now() - 24 * 60 * 60 * 1000 ? 0 : 1
                      ]
                    }
                  </div>
                </NoSSR>
              </div>
              <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                {e.lastContent}
              </div>
            </Link>
          </li>
        ))}
    </ul>
  );
}
