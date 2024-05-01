"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  host: string;
};

export default function ChatForm({ host }: Props) {
  const [content, setContent] = useState("");
  return (
    <div>
      <form
        action={async () => {
          setContent("");
        }}
      >
        <div className="flex space-x-4">
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
    </div>
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
