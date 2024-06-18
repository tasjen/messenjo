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
import { chatClient } from "@/lib/grpc-clients/web";
import { parse as uuidParse } from "uuid";

type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const params = useParams<{ groupId: string }>();
  const store = useStore();
  const listRef = useRef<HTMLUListElement>(null);

  const contact = store.contacts.find((e) => e.groupId === params.groupId);

  useEffect(() => {
    // cannot loadMessages in a useEffect with empty dependency array
    // as it randomly makes some users fail to render messages UI
    // (render only one message which is the lastMessage)
    store.loadMessages(props.messages);
  }, [contact?.messagesLoaded]);

  useEffect(() => {
    return () => {
      // This callback will be invoke on component mount/unmount.
      // It resets the unread counts on both client and server of
      // the current chat room once after enter and another after
      // leave. For example, if a user navigate from chat room 'A'
      // to 'B', the unreadCount on both client and server of chat
      // room 'A' and 'B' will be reset if the unreadCount of each
      // chat room is not zero. The unreadCount of the last chat room
      // that the user has visited before closing the page will be
      // reset by onbeforeunload event in ContactListClient.
      store.resetUnreadCount();
      if (contact && contact.unreadCount !== 0) {
        chatClient
          .resetUnreadCount(
            { groupId: uuidParse(params.groupId) },
            { timeoutMs: 5000 }
          )
          .catch((err) => toast(err.message));
      }
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollIntoView(false);
  }, [contact?.messages.length]);

  if (!store.user || !contact?.messagesLoaded) {
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
