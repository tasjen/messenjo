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
import * as actions from "@/lib/actions";
import { toast } from "sonner";
type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const params = useParams<{ groupId: string }>();
  const store = useStore();
  const listRef = useRef<HTMLUListElement>(null);

  const contact = store.contacts.find((e) => e.groupId === params.groupId);

  useEffect(() => {
    // have to add some delay as some users experience a bug
    // where `store.loadMessages` failed to add `props.messages`
    // to the contact, resulting in ChatBoard only show one
    // message (which is the lastMessage fetched from ContactList)
    setTimeout(() => store.loadMessages(props.messages), 500);
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
      if (contact && contact.unreadCount !== 0) {
        actions
          .resetUnreadCount(params.groupId)
          .catch((err) => toast(err.message));
        store.resetUnreadCount();
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
