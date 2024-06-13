/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Message } from "@/lib/schema";
import { useStore } from "@/lib/stores/client-store";
import ChatBoardSkeleton from "@/components/skeletons/chat-board";
import MessageItem from "./message-item";
import GroupMenuButton from "./group-menu-button";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import * as actions from "@/lib/actions";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const { groupId } = useParams<{ groupId: string }>();
  const store = useStore();
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedResetUnreadCount = useDebouncedCallback(
    (groupId: string) => {
      actions.resetUnreadCount(groupId).catch((err) => toast(err.message));
    },
    2000,
    { leading: true }
  );

  useEffect(() => {
    store.loadMessages(groupId, props.messages);
    store.resetUnreadCount(groupId);
  }, []);

  const contact = store.contacts.find((e) => e.groupId === groupId);

  useEffect(() => {
    listRef.current?.scrollIntoView(false);
    if (
      contact &&
      contact.unreadCount !== 0 &&
      contact.messages[0]?.fromUsername !== store.user.username
    ) {
      debouncedResetUnreadCount(groupId);
    }
  }, [contact]);

  if (!store.user || !contact) {
    return <ChatBoardSkeleton />;
  }

  return (
    <>
      <div className="my-2 flex items-center gap-4 justify-between">
        <div className="font-bold text-xl ml-2">{contact.name}</div>
        {contact.type === "group" && <GroupMenuButton className="mr-auto" />}
        <Link href="/" className="flex justify-center items-center w-20">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <ScrollArea className="h-full pr-3 -mr-3">
        <ul
          ref={listRef}
          className="flex flex-col-reverse gap-2 overflow-auto mb-auto border-t pt-2"
        >
          {contact.messages.map((message) => (
            <MessageItem key={message.id} contact={contact} message={message} />
          ))}
        </ul>
      </ScrollArea>
    </>
  );
}
