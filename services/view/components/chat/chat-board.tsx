/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Message } from "@/lib/schema";
import { toDateFormat } from "@/lib/utils";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import ChatBoardSkeleton from "../skeletons/chat-board";
import { useClientStore } from "@/lib/stores/client-store";

type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const { groupId } = useParams<{ groupId: string }>();
  const store = useClientStore();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    store.loadMessages(groupId, props.messages);
  }, []);

  const contact = store.contacts?.find((e) => e.groupId === groupId);
  const room = store.chatRooms?.find((e) => e.groupId === groupId);

  console.log(room);
  console.log(store.chatRooms);

  if (!store.user || !contact || !room) {
    return <ChatBoardSkeleton />;
  }

  return (
    <>
      <div className="font-bold text-lg mb-4">{contact.name}</div>
      <ul
        ref={listRef}
        className="flex flex-col-reverse gap-2 overflow-auto h-full"
      >
        {room?.messages.map((e) => {
          const isFromMe = store.user?.username === e.fromUsername;
          return (
            <li key={e.id} className={clsx("flex flex-col")}>
              {contact?.type === "group" && (
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
                <div className="flex-1 rounded-xl bg-gray-200 p-2 break-words max-w-[768px]">
                  {e.content}
                </div>
                <div className="self-end text-xs">
                  {toDateFormat(e.sentAt)[1]}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
