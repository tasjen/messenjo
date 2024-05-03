// import { getContacts, getUser } from "@/components/cache";
import ChatForm from "@/components/chat-form";
import getQueryClient from "@/components/get-query-client";
import ChatBoard from "@/components/messages/chat-board";
import { fetchMessages } from "@/lib/data";
import env from "@/lib/env";
import { useStore } from "@/lib/zustand-provider";

export default async function ChatPage() {
  const messages = await fetchMessages();
  const { user, contacts } = useStore.getState();

  return (
    <>
      <ChatBoard messages={messages} user={user} contacts={contacts} />
      <ChatForm host={env.HOST} />
    </>
  );
}
