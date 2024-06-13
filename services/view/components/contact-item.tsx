"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import clsx from "clsx";
import dayjs from "dayjs";
import type { Contact } from "@/lib/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoSSR from "@/components/no-ssr";
import { Badge } from "./ui/badge";
import { useStore } from "@/lib/stores/client-store";
import * as actions from "@/lib/actions";
import { toast } from "sonner";
import { useCallback } from "react";

type Props = {
  contact: Contact;
};

export default function ContactItem({ contact }: Props) {
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
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

  // Invoking this will reset the unread counts(both in the client and server)
  // of the current chat room before navigating to another chat room
  // via the Link component below. For example, if a user navigate
  // from chat room 'A' to 'B', the unreadCount of chat room 'A'
  // will be reset. Not 'B'. The unreadCount of the last chat room
  // that the user is in before closing the page will be handled
  // by onbeforeunload event in ContactListClient.
  const resetUnreadCount = useCallback(() => {
    const currentContact = store.contacts.find(
      (c) => c.groupId === params.groupId
    );
    if (currentContact && currentContact.unreadCount !== 0) {
      actions
        .resetUnreadCount(params.groupId)
        .catch((err) => toast(err.message));
      store.resetUnreadCount();
    }
  }, [store, params.groupId]);

  return (
    // Don't set this onClick to Link as ChatBoards will somehow get revalidated
    <li onClick={resetUnreadCount}>
      <Link
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
            {contact.unreadCount !== 0 &&
              contact.groupId !== params.groupId && (
                <Badge className="py-[0.25px] px-[6px] text-xs font-medium">
                  {contact.unreadCount}
                </Badge>
              )}
          </div>
        </div>
      </Link>
    </li>
  );
}
