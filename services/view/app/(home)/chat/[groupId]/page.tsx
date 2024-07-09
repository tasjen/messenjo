import ChatPageClient from "@/components/chat/chat-page-client";
import { fetchLatestMessages } from "@/lib/data";

type Props = {
  params: { groupId: string };
};

export default async function ChatPage({ params: { groupId } }: Props) {
  const messages = await fetchLatestMessages(groupId);
  return <ChatPageClient messages={messages} />;
}
