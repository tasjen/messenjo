"use client";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store/client";
import ChatFormSkeleton from "@/components/skeletons/chat-form";
import { SendHorizonal } from "lucide-react";
import { chatClient } from "@/lib/grpc-clients/web";
import { parse as uuidParse } from "uuid";
import { handleWebError } from "@/lib/util";

export default function ChatForm() {
  const params = useParams<{ groupId: string }>();
  const store = useStore((s) => s);
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
      .addMessage({
        groupId: uuidParse(params.groupId),
        content,
        sentAt: {
          seconds: BigInt(Math.floor(sentAt / 1e3)),
          nanos: new Date(sentAt).getMilliseconds() * 1e6,
        },
      })
      .catch(handleWebError);
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
