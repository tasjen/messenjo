"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { sendMessage } from "@/lib/actions";
import { useClientStore } from "@/lib/stores/client-store";
import ChatFormSkeleton from "./skeletons/chat-form";

type Props = {
  host: string;
};

export default function ChatForm({ host }: Props) {
  const [content, setContent] = useState("");
  const { groupId } = useParams<{ groupId: string }>();
  const store = useClientStore();

  if (!store.user || !store.contacts) {
    return <ChatFormSkeleton />;
  }

  return (
    <form
      action={async () => {
        if (content === "") return;
        const sentAt = Date.now();
        const messageId = await sendMessage(groupId, content, sentAt);
        store.addMessage(groupId, {
          id: messageId,
          fromUsername: store.user?.username ?? "username is undefined",
          content,
          sentAt,
        });
        setContent("");
      }}
    >
      <div className="flex gap-4">
        <Input
          type="text"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          autoComplete="off"
        />
        <Button type="submit">send</Button>
      </div>
    </form>
  );
}

// const [message, setMessage] = useState("");
// const [messages, setMessages] = useState<string[]>([]);
// const { lastMessage, readyState } = useWebSocket(
//   `ws://${host}/api/streaming/subscribe`,
//   {
//     shouldReconnect: () => true,
//     reconnectAttempts: 5,
//     reconnectInterval: 5,
//   }
// );

// useEffect(() => {
//   if (typeof lastMessage?.data === "string") {
//     setMessages((prev) => [...prev, lastMessage.data]);
//   }
// }, [lastMessage]);
