/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Message } from "@/lib/schema";
import { useStore } from "@/lib/stores/client-store";
import ChatBoardSkeleton from "@/components/skeletons/chat-board";
import MessageItem from "./message-item";

type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const { groupId } = useParams<{ groupId: string }>();
  const store = useStore();

  useEffect(() => {
    store.loadMessages(groupId, props.messages);
  }, []);

  const contact = store.contacts.find((e) => e.groupId === groupId);
  const room = store.chatRooms.find((e) => e.groupId === groupId);

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
      <ul className="flex flex-col-reverse gap-2 overflow-auto mb-auto border-t pt-2">
        {room.messages.map((message) => (
          <MessageItem key={message.id} contact={contact} message={message} />
        ))}
      </ul>
    </>
  );
}
