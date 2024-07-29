"use client";

import { useCallback } from "react";
import { Message } from "@/lib/schema";
import { useStore } from "@/lib/store/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import clsx from "clsx";
import dayjs from "dayjs";

type Props = {
  message: Message;
};

export default function MessageItem({ message }: Props) {
  const store = useStore();
  const isFromMe = store.user.username === message.fromUsername;
  const contact = store.currentContact;
  const formattedDate = useCallback((sentAt: number): string => {
    const now = dayjs();
    if (now.isSame(sentAt, "day")) {
      return "today";
    } else if (now.subtract(1, "day").isSame(sentAt, "day")) {
      return "yesterday";
    } else if (now.isSame(sentAt, "year")) {
      return dayjs(sentAt).format("DD/MM");
    } else {
      return dayjs(sentAt).format("DD/MM/YYYY");
    }
  }, []);

  if (!contact) return <></>;

  return (
    <li>
      {contact.type === "group" && !isFromMe && (
        <div className="text-xs mb-1 font-medium">{message.fromUsername}</div>
      )}
      <div
        className={clsx(
          "flex gap-2 flex-nowrap",
          isFromMe ? "ml-auto flex-row-reverse" : "mr-auto"
        )}
      >
        {!isFromMe && (
          <Avatar className="self-start">
            <AvatarImage
              src={message.fromPfp}
              alt={`${message.fromUsername}'s pfp`}
            />
            <AvatarFallback>
              {message.fromUsername[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className="flex-none rounded-3xl px-3 bg-muted p-2 break-words
          max-w-[320px] lg:max-w-[540px] 2xl:max-w-[960px]"
        >
          {message.content}
        </div>
        <div className="self-center text-[0.7rem] flex flex-col text-ring">
          <div>{formattedDate(message.sentAt)}</div>
          <div className={clsx(isFromMe && "self-end")}>
            {dayjs(message.sentAt).format("HH:mm")}
          </div>
        </div>
      </div>
    </li>
  );
}
