/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Message } from "@/lib/schema";
import { useStore } from "@/lib/store/client";
import ChatBoardSkeleton from "@/components/skeletons/chat-board";
import MessageItem from "./message-item";
import GroupMenuButton from "./group-menu-button";
import { chatClient } from "@/lib/grpc-clients/web";
import { parse as uuidParse } from "uuid";
import { handleWebError } from "@/lib/util";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import { MESSAGES_BATCH_SIZE } from "@/lib/config";
import FriendMenuButton from "./friend-menu-button";

type Props = {
  messages: Message[];
};

export default function ChatBoard(props: Props) {
  const params = useParams<{ groupId: string }>();
  const store = useStore();
  const listRef = useRef<HTMLUListElement>(null);
  const msgLoader = useInView({ threshold: 0.9 });

  const contact = store.contacts.find((e) => e.groupId === params.groupId);

  const loadMoreMessages = useDebouncedCallback(() => {
    if (!msgLoader.inView || !contact || contact.allMessagesLoaded) return;
    chatClient
      .getMessages({
        groupId: uuidParse(params.groupId),
        start: contact.messages.length + 1,
        end: contact.messages.length + MESSAGES_BATCH_SIZE,
      })
      .then(({ messages }) =>
        store.loadOlderMessages(
          params.groupId,
          messages.map((m) =>
            Message.parse({
              ...m,
              sentAt: m.sentAt?.toDate().getTime() ?? 0,
            })
          )
        )
      )
      .catch(handleWebError);
  }, 300);

  useEffect(() => {
    return () => {
      // This callback is invoked on component mount/unmount.
      // It resets the unread counts on both client and server of
      // the current chat room once on entering and another on
      // leaving. For example, if a user navigate from chat room 'A'
      // to 'B', the unreadCount on both client and server of chat
      // room 'A' and 'B' will be reset whether it's zero or not
      // (cannot check if unreadCount is 0 since the unreadCount
      // inside this callback won't update and its value will always
      // be the value at first page mount). If a user close the page
      // on a chat room. The unreadCount of that chat room will be
      // reset by 'onbeforeunload' event in ContactListClient
      chatClient
        .resetUnreadCount({ groupId: uuidParse(params.groupId) })
        .then(() => store.resetUnreadCount(params.groupId))
        .catch(handleWebError);
    };
  }, []);

  useEffect(() => {
    // cannot loadMessages in a useEffect with an empty dependency array
    // as loadMessages may run before loadContacts, making some users
    // randomly fail to render messages
    store.loadLatestMessages(params.groupId, props.messages);
  }, [contact?.latestMessagesLoaded]);

  // scroll to bottom if the user send a message
  useEffect(() => {
    if (
      !msgLoader.inView &&
      contact &&
      contact.messages[0]?.fromUsername === store.user.username
    ) {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    // call loadMoreMessages again in case 'inView' is still 'true' after loaded
    loadMoreMessages();
  }, [contact?.messages.length]);

  useEffect(() => {
    loadMoreMessages();
  }, [msgLoader.inView]);

  if (!store.user || !contact?.latestMessagesLoaded) {
    return <ChatBoardSkeleton />;
  }

  return (
    <>
      <div className="my-2 flex items-center gap-4 justify-between">
        <div
          className="font-bold text-xl ml-2"
          onClick={() => {
            if (contact.type === "group") return;
            chatClient
              .unfriend({ toUserId: uuidParse(contact.userId) })
              .catch(handleWebError);
          }}
        >
          {contact.name}
        </div>
        {contact.type === "friend" ? (
          <FriendMenuButton className="mr-auto" />
        ) : (
          <GroupMenuButton className="mr-auto" />
        )}
        <Link href="/" className="flex justify-center items-center w-20">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </div>
      <ul
        ref={listRef}
        className="flex flex-col-reverse gap-2 overflow-auto mb-auto
        border-t pt-2 pr-2 -mr-2"
      >
        {contact.messages.map((message) => (
          <MessageItem key={message.id} contact={contact} message={message} />
        ))}
        {!contact.allMessagesLoaded && (
          <div ref={msgLoader.ref} className="mx-auto">
            <Loader2
              strokeWidth={msgLoader.inView ? 3 : 0}
              className="animate-spin self-center"
            />
          </div>
        )}
      </ul>
    </>
  );
}
