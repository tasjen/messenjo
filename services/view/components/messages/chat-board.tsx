/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Contact, Message, User } from "@/lib/data";
import { toDateFormat } from "@/lib/utils";
import { useEffect } from "react";
import NoSSR from "../no-ssr";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useClientStore } from "@/lib/stores/client-store";

type Props = {
  messages: Message[];
  user: User;
  contacts: Contact[];
};

export default function ChatBoard(props: Props) {
  const { groupId } = useParams<{ groupId: string }>();
  const { user, contacts, chatRooms, addChatRoom } = useClientStore();
  const contact = (contacts || props.contacts)?.find(
    (e) => e.groupId === groupId
  );
  const contactName = contact?.name;

  useEffect(() => {
    addChatRoom({ groupId, messages: props.messages });
  }, []);

  return (
    <>
      <div className="font-bold text-lg mb-auto">{contactName}</div>
      <ul className="flex flex-col gap-2 overflow-auto h-full">
        {(
          chatRooms?.find((e) => e.groupId === groupId)?.messages ??
          props.messages
        ).map((e) => (
          <li
            key={e.id}
            className={clsx(
              "flex gap-2",
              (user ?? props.user)?.username === e.fromUsername &&
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
