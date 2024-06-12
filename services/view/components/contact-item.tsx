"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import dayjs from "dayjs";
import type { Contact } from "@/lib/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoSSR from "@/components/no-ssr";
import { Badge } from "./ui/badge";
import { useStore } from "@/lib/stores/client-store";
import * as actions from "@/lib/actions";
import { toast } from "sonner";

type Props = {
  contact: Contact;
};

export default function ContactItem({ contact }: Props) {
  const pathname = usePathname();
  const store = useStore();

  function formattedTime(lastSentAt?: number): string {
    const now = dayjs();
    if (!lastSentAt) {
      return "No data";
    } else if (now.isSame(lastSentAt, "day")) {
      return dayjs(lastSentAt).format("HH:mm");
    } else if (now.subtract(1, "day").isSame(lastSentAt, "day")) {
      return "Yesterday";
    } else if (now.subtract(7, "day").isBefore(lastSentAt, "day")) {
      return dayjs(lastSentAt).format("ddd");
    } else if (now.isSame(lastSentAt, "year")) {
      return dayjs(lastSentAt).format("DD/MM");
    } else {
      return dayjs(lastSentAt).format("DD/MM/YYYY");
    }
  }

  // no async/await so that navigation is instant
  function resetUnreadCount(): void {
    if (contact.unreadCount !== 0) {
      store.resetUnreadCount(contact.groupId);
      actions
        .resetUnreadCount(contact.groupId)
        .catch(() => toast(`internal server error`));
    }
  }

  return (
    <Link
      onClick={resetUnreadCount}
      href={`/chat/${contact.groupId}`}
      className={clsx("flex gap-2 p-2 rounded-lg", {
        "bg-[#dddddd] dark:bg-[#333333]":
          pathname === `/chat/${contact.groupId}`,
      })}
    >
      <Avatar className="self-center">
        <AvatarImage src={contact.pfp} alt={`${contact.name}'s pfp`} />
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 flex flex-col">
        <div className="flex">
          <div className="font-bold text-ellipsis max-w-44 overflow-hidden">
            {contact.name}
          </div>
          <div className="ml-2">
            {contact.type === "group" && `(${contact.memberCount})`}
          </div>
          <NoSSR>
            <div className="ml-auto text-xs self-center">
              {formattedTime(contact.messages[0]?.sentAt)}
            </div>
          </NoSSR>
        </div>
        <div className="flex">
          <div className="text-sm text-ellipsis overflow-hidden whitespace-nowrap text-ring max-w-48 mr-auto">
            {contact.messages[0]?.content}
          </div>
          {contact.unreadCount !== 0 && (
            <Badge className="py-[0.25px] px-[6px] text-xs font-medium">
              {contact.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
