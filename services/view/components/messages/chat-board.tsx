"use client";
import { Contact, Message, User } from "@/lib/data";
import { toDateFormat } from "@/lib/utils";
import { useState } from "react";
import NoSSR from "../no-ssr";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/zustand-provider";

type Props = {
  messages: Message[];
  user: User;
  contacts: Contact[];
};

export default function ChatBoard(props: Props) {
  const [messages, setMessages] = useState(props.messages);
  const { groupId } = useParams<{ groupId: string }>();
  const contact = props.contacts?.find((e) => e.groupId === groupId);
  const contactName = contact?.name;
  useStore.setState({ user: props.user, contacts: props.contacts });

  return (
    <>
      <div className="font-bold text-lg mb-4">{contactName}</div>
      <ul className="flex flex-col gap-2">
        {messages.map((e) => (
          <li
            key={e.id}
            className={clsx(
              "flex gap-2",
              props.user?.username === e.fromUsername &&
                "ml-auto flex-row-reverse"
            )}
          >
            <div className={clsx("rounded-xl bg-gray-200 p-2")}>
              {e.content}
            </div>
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
