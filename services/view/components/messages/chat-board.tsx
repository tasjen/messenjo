/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Message } from "@/lib/data";
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
  const contactName = store.contacts?.find((e) => e.groupId === groupId)?.name;

  useEffect(() => {
    store.addChatRoom({ groupId, messages: props.messages });
  }, []);

  if (!store.user || !store.contacts) {
    return <ChatBoardSkeleton />;
  }

  return (
    <>
      <div className="font-bold text-lg mb-4">{contactName}</div>
      <ul className="flex flex-col gap-2 overflow-auto h-full">
        {(
          store.chatRooms?.find((e) => e.groupId === groupId)?.messages ??
          props.messages
        ).map((e) => (
          <li
            key={e.id}
            className={clsx(
              "flex gap-2",
              store.user?.username === e.fromUsername &&
                "ml-auto flex-row-reverse"
            )}
          >
            <div className="rounded-xl bg-gray-200 p-2">{e.content}</div>
            <NoSSR>
              <div className="self-end text-xs">
                {toDateFormat(e.sentAt)[1]}
              </div>
            </NoSSR>
          </li>
        ))}
      </ul>
    </>
  );
}
