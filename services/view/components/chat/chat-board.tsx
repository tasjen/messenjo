/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Message } from "@/lib/schema";
import { toDateFormat } from "@/lib/utils";
import { useEffect } from "react";
import NoSSR from "../no-ssr";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useClientStore } from "@/lib/stores/client-store";
import ChatBoardSkeleton from "../skeletons/chat-board";

type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const { groupId } = useParams<{ groupId: string }>();
  const store = useClientStore();
  const contact = store.contacts?.find((e) => e.groupId === groupId);

  useEffect(() => {
    store.addChatRooms({ groupId, messages: props.messages });
  }, []);

  if (!store.user || !contact) {
    return <ChatBoardSkeleton />;
  }

  const chatRoom = store.chatRooms?.find((e) => e.groupId === groupId);

  return (
    <>
      <div className="font-bold text-lg mb-4">{contact.name}</div>
      <ul className="flex flex-col gap-2 overflow-auto h-full">
        {(chatRoom?.messages ?? props.messages).map((e) => {
          const isFromMe = store.user?.username === e.fromUsername;
          return (
            <li key={e.id} className={clsx("flex flex-col")}>
              {contact?.type === "group" && (
                <div
                  className={clsx("text-xs font-medium", isFromMe && "ml-auto")}
                >
                  {e.fromUsername}
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
                <NoSSR>
                  <div className="self-end text-xs">
                    {toDateFormat(e.sentAt)[1]}
                  </div>
                </NoSSR>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
