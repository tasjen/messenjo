"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import dayjs from "dayjs";
import type { Contact } from "@/lib/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoSSR from "@/components/no-ssr";

type Props = {
  contact: Contact;
};

export default function ContactItem({ contact }: Props) {
  const pathname = usePathname();

  function formattedTime(lastSentAt?: number): string {
    const now = dayjs();
    if (!lastSentAt) {
      return "no data";
    } else if (now.isSame(lastSentAt, "day")) {
      return dayjs(lastSentAt).format("HH:mm");
    } else if (now.subtract(1, "day").isSame(lastSentAt, "day")) {
      return "yesterday";
    } else if (now.subtract(7, "day").isBefore(lastSentAt, "day")) {
      return dayjs(lastSentAt).format("ddd");
    } else if (now.isSame(lastSentAt, "year")) {
      return dayjs(lastSentAt).format("DD/MM");
    } else {
      return dayjs(lastSentAt).format("DD/MM/YYYY");
    }
  }

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
              <div className="ml-2">
                {contact.type === "group" && `(${contact.memberCount})`}
              </div>
              <NoSSR>
                <div className="ml-auto text-xs self-center">
                  {formattedTime(contact.lastMessage?.sentAt)}
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
