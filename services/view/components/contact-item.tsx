"use client";

import type { Contact } from "@/lib/schema";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import NoSSR from "./no-ssr";
import dayjs from "dayjs";
import clsx from "clsx";
import { usePathname } from "next/navigation";

type Props = {
  contact: Contact;
};

export default function ContactItem({ contact }: Props) {
  const pathname = usePathname();
  const lastSentAt = contact.lastMessage?.sentAt;
  const now = dayjs();

  return (
    <li
      className={clsx("p-2 rounded-lg", {
        "bg-[#dddddd] dark:bg-[#333333]":
          pathname === `/chat/${contact.groupId}`,
      })}
    >
      <Link href={`/chat/${contact.groupId}`}>
        <div className="flex gap-2">
          <Avatar className="self-center">
            <AvatarImage src={contact.pfp} alt={`${contact.name}'s pfp`} />
            <AvatarFallback>{contact.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col">
            <div className="flex">
              <div className="font-bold text-ellipsis max-w-32 overflow-hidden">
                {contact.name}
              </div>
              {contact.type === "group" && (
                <div className="ml-2">({contact.memberCount})</div>
              )}
              <NoSSR>
                <div className="ml-auto text-xs self-center">
                  {!lastSentAt
                    ? "no data"
                    : now.isSame(lastSentAt, "day")
                      ? dayjs(lastSentAt).format("HH:mm")
                      : now.subtract(1, "day").isSame(lastSentAt, "day")
                        ? "yesterday"
                        : now.isSame(lastSentAt, "week")
                          ? dayjs(lastSentAt).format("ddd")
                          : now.isSame(lastSentAt, "year")
                            ? dayjs(lastSentAt).format("DD/MM")
                            : dayjs(lastSentAt).format("DD/MM/YYYY")}
                </div>
              </NoSSR>
            </div>
            <div className="flex-initial text-sm text-ellipsis overflow-hidden whitespace-nowrap text-ring max-w-48">
              {contact.lastMessage?.content}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
