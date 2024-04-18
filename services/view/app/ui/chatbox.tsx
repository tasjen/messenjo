"use client";
import { useState, useEffect, type FormEvent } from "react";
import useWebSocket from "react-use-websocket";

type Props = {
  host: string;
};

export default function Chatbox({ host }: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const { lastMessage, sendJsonMessage, readyState } = useWebSocket(
    `ws://${host}/api/streaming/subscribe`
    // {
    //   shouldReconnect: () => true,
    //   reconnectAttempts: 5,
    //   reconnectInterval: 5,
    // }
  );

  useEffect(() => {
    if (typeof lastMessage?.data === "string") {
      setMessages((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    sendJsonMessage({ message, to: "all" });
    setMessage("");
  }

  return (
    <div>
      {messages.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button>send</button>
      </form>
      <div>readyState: {readyState}</div>
    </div>
  );
}
