// import ChatForm from "@/components/chat/chat-form";
import ChatBoard from "@/components/chat/chat-board";
import ChatForm from "@/components/chat/chat-form";
import { fetchMessages } from "@/lib/data";
import env from "@/lib/env";

type Props = {
  params: { groupId: string };
};

export default async function ChatPage({ params: { groupId } }: Props) {
  const messages = await fetchMessages(groupId);
  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <ChatBoard messages={messages} />
      <ChatForm />
    </div>
  );
}
