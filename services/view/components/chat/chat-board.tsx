/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Message } from "@/lib/schema";
import { toDateFormat } from "@/lib/utils";
import { useStore } from "@/lib/stores/client-store";
import ChatBoardSkeleton from "../skeletons/chat-board";
import { isToday, isYesterday } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const { groupId } = useParams<{ groupId: string }>();
  const store = useStore();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    store.setMessages(groupId, props.messages);
  }, []);

  const contact = store.contacts?.find((e) => e.groupId === groupId);
  const room = store.chatRooms?.find((e) => e.groupId === groupId);

  if (!store.user || !contact || !room) {
    return <ChatBoardSkeleton />;
  }

  return (
    <>
      <div className="my-2 flex items-center">
        <div className="font-bold text-lg mr-auto">{contact.name}</div>
        <Link href="/" className="flex justify-center items-center w-20">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <ul
        ref={listRef}
        className="flex flex-col-reverse gap-2 overflow-auto mb-auto border-t pt-2"
      >
        {room.messages.map((message) => {
          const isFromMe = store.user.username === message.fromUsername;
          const { date, time } = toDateFormat(message.sentAt);

          return (
            <li key={message.id} className={"mr-1"}>
              {contact.type === "group" && !isFromMe && (
                <div className="text-xs mb-1 font-medium">
                  {message.fromUsername}
                </div>
              )}
              <div
                className={clsx(
                  "flex gap-2 flex-nowrap",
                  isFromMe ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {!isFromMe && (
                  <Avatar className="self-center">
                    <AvatarImage
                      src={message.fromPfp}
                      alt={`${message.fromUsername}'s pfp`}
                    />
                    <AvatarFallback>
                      {message.fromUsername[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-none rounded-full px-3 bg-muted p-2 break-words max-w-[768px]">
                  {message.content}
                </div>
                <div className="self-center text-[0.7rem] flex flex-col text-ring">
                  <div>
                    {isToday(message.sentAt)
                      ? "today"
                      : isYesterday(message.sentAt)
                        ? "yesterday"
                        : date}
                  </div>
                  <div className={clsx(isFromMe && "self-end")}>{time}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
