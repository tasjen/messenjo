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
        {room.messages.map((e) => {
          const isFromMe = store.user.username === e.fromUsername;
          const { date, time } = toDateFormat(e.sentAt);

          return (
            <li key={e.id} className={"flex flex-col mr-1"}>
              {contact.type === "group" && (
                <div
                  className={clsx("text-xs font-medium", isFromMe && "ml-auto")}
                >
                  {!isFromMe && e.fromUsername}
                </div>
              )}
              <div
                className={clsx(
                  "flex gap-2 flex-nowrap",
                  isFromMe ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className="flex-1 rounded-xl bg-muted p-2 break-words max-w-[768px]">
                  {e.content}
                </div>
                <div className="self-center text-[0.7rem] flex flex-col text-ring">
                  <div>
                    {isToday(e.sentAt)
                      ? "today"
                      : isYesterday(e.sentAt)
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
