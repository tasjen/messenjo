/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/lib/schema";
import { useStore } from "@/lib/stores/client-store";
import ChatBoardSkeleton from "@/components/skeletons/chat-board";

type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const { groupId } = useParams<{ groupId: string }>();
  const store = useStore();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    store.loadMessages(groupId, props.messages);
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
          const now = dayjs();

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
                <div
                  className="flex-none rounded-3xl px-3 bg-muted p-2 break-words
                  max-w-[320px] lg:max-w-[540px] 2xl:max-w-[960px]"
                >
                  {message.content}
                </div>
                <div className="self-center text-[0.7rem] flex flex-col text-ring">
                  <div>
                    {now.isSame(message.sentAt, "day")
                      ? "today"
                      : now.subtract(1, "day").isSame(message.sentAt, "day")
                        ? "yesterday"
                        : now.isSame(message.sentAt, "year")
                          ? dayjs(message.sentAt).format("DD/MM")
                          : dayjs(message.sentAt).format("DD/MM/YYYY")}
                  </div>
                  <div className={clsx(isFromMe && "self-end")}>
                    {dayjs(message.sentAt).format("HH:mm")}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
