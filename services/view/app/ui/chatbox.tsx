"use client";
import { sendMessage } from "@/lib/actions";
import { useRef, useState } from "react";

type Props = {
  host: string;
};

export default function Chatbox({ host }: Props) {
  const [content, setContent] = useState("");
  return (
    <div>
      <form
        action={async () => {
          await sendMessage({ user_id: "123", group_id: "456", date: "789" });
          setContent("");
        }}
      >
        <input
          type="text"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          autoComplete="off"
        />
        <button type="submit">send</button>
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
