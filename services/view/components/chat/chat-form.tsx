"use client";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/stores/client-store";
import ChatFormSkeleton from "@/components/skeletons/chat-form";
import { SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { chatClient } from "@/lib/grpc-clients/web";
import { parse as uuidParse } from "uuid";

export default function ChatForm() {
  const params = useParams<{ groupId: string }>();
  const store = useStore();
  const contentInput = useRef<HTMLInputElement>(null);

  if (!store.user || !store.contacts || store.isWsDisconnected) {
    return <ChatFormSkeleton />;
  }

  function handleSubmit(): void {
    const content = contentInput.current?.value;
    if (!content) return;

    const sentAt = new Date().getTime();
    store.addMessage(params.groupId, {
      id: Math.random(),
      fromUsername: store.user.username,
      fromPfp: store.user.pfp,
      content,
      sentAt,
    });
    chatClient
      .addMessage(
        {
          userId: uuidParse(store.user.id),
          groupId: uuidParse(params.groupId),
          content,
          sentAt: {
            seconds: BigInt(Math.floor(sentAt / 1e3)),
            nanos: new Date(sentAt).getMilliseconds() * 1e6,
          },
        },
        { timeoutMs: 5000 }
      )
      .catch(() => toast(`failed to send message: '${content}'`));
    contentInput.current.value = "";
  }

  return (
    <div className="flex gap-4">
      <Input
        type="text"
        ref={contentInput}
        onKeyDown={({ key }) => {
          if (key === "Enter") handleSubmit();
        }}
        autoComplete="off"
        autoFocus
      />
      <Button onClick={handleSubmit}>
        <SendHorizonal />
      </Button>
    </div>
  );
}
