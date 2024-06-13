"use client";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import * as actions from "@/lib/actions";
import { useStore } from "@/lib/stores/client-store";
import ChatFormSkeleton from "@/components/skeletons/chat-form";
import { SendHorizonal } from "lucide-react";
import { toast } from "sonner";

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
    actions
      .addMessage(params.groupId, content, sentAt)
      .catch(() => toast(`failed to send message: '${content}'`));
    contentInput.current.value = "";
  }

  return (
    <form action={handleSubmit}>
      <div className="flex gap-4">
        <Input type="text" ref={contentInput} autoComplete="off" autoFocus />
        <Button type="submit">
          <SendHorizonal />
        </Button>
      </div>
    </form>
  );
}
