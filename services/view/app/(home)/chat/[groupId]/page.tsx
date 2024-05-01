import ChatForm from "@/components/chat-form";
import ChatBoard from "@/components/messages/chat-board";
import env from "@/lib/env";

type Props = {
  params: { groupId: string };
};

export default async function MessagePage({ params }: Props) {
  // const messages = await fetchMessage(params.groupId)
  return (
    <>
      <div>{params.groupId}</div>
      <ChatBoard messages={[]} />
      <ChatForm host={env.HOST} />
    </>
  );
}
