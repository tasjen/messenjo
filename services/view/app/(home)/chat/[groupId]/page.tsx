import ChatForm from "@/components/chat-form";
import ChatBoard from "@/components/messages/chat-board";
import { fetchMessages } from "@/lib/data";
import env from "@/lib/env";
import { serverStore } from "@/lib/stores/server-store";

type Props = {
  params: { groupId: string };
};

export default async function ChatPage({ params: { groupId } }: Props) {
  const messages = await fetchMessages(groupId);
  const { user, contacts } = serverStore.getState();

  return (
    <>
      <ChatBoard messages={messages} user={user} contacts={contacts} />
      <ChatForm host={env.HOST} />
    </>
  );
}
