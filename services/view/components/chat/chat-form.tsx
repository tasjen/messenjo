"use client";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { sendMessage } from "@/lib/actions";
import { useStore } from "@/lib/stores/client-store";
import ChatFormSkeleton from "@/components/skeletons/chat-form";
import { SendHorizonal } from "lucide-react";
import { toast } from "sonner";

export default function ChatForm() {
  const params = useParams<{ groupId: string }>();
  const store = useStore();
  const contentInput = useRef<HTMLInputElement>(null);
  const sendButton = useRef<HTMLButtonElement>(null);
  const [content, setContent] = useState("");

  if (!store.user || !store.contacts || store.isWsDisconnected) {
    return <ChatFormSkeleton />;
  }

  async function handleSubmit(): Promise<void> {
    if (content === "") {
      return contentInput.current?.focus();
    }

    contentInput.current!.disabled = true;
    sendButton.current!.disabled = true;

    try {
      const sentAt = new Date();
      const messageId = await sendMessage(params.groupId, content, sentAt);
      store.addMessage(params.groupId, {
        id: messageId,
        fromUsername: store.user.username,
        fromPfp: store.user.pfp,
        content,
        sentAt: sentAt.getTime(),
      });
      setContent("");
      contentInput.current!.disabled = false;
      sendButton.current!.disabled = false;
      contentInput.current?.focus();
    } catch (err) {
      toast(`failed to send message: '${content}'`);
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="flex gap-4">
        <Input
          type="text"
          value={content}
          onChange={({ target: { value } }) => setContent(value)}
          ref={contentInput}
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" ref={sendButton}>
          <SendHorizonal />
        </Button>
      </div>
    </form>
  );
}
