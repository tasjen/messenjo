"use client";
import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { sendMessage } from "@/lib/actions";
import { useClientStore } from "@/lib/stores/client-store";
import ChatFormSkeleton from "../skeletons/chat-form";

export default function ChatForm() {
  const { groupId } = useParams<{ groupId: string }>();
  const store = useClientStore();
  const contentInput = useRef<HTMLInputElement>(null);
  const sendButton = useRef<HTMLButtonElement>(null);

  if (!store.user || !store.contacts) {
    return <ChatFormSkeleton />;
  }

  return (
    <form
      action={async (formData) => {
        const content = formData.get("content") as string;
        if (content === "") {
          contentInput.current?.focus();
          return;
        }

        contentInput.current!.disabled = true;
        sendButton.current!.disabled = true;

        try {
          const sentAt = new Date();
          const messageId = await sendMessage.bind(
            null,
            groupId,
            sentAt
          )(formData);
          store.addMessage(groupId, {
            id: messageId,
            fromUsername: store.user.username,
            content,
            sentAt: sentAt.getTime(),
          });
        } catch (err) {
          console.log("failed to send message");
          console.error(err);
        }
        contentInput.current!.value = "";
        contentInput.current!.disabled = false;
        sendButton.current!.disabled = false;
        contentInput.current?.focus();
      }}
    >
      <div className="flex gap-4">
        <Input
          type="text"
          name="content"
          ref={contentInput}
          autoComplete="off"
          autoFocus
        />
        <Button type="submit" ref={sendButton}>
          send
        </Button>
      </div>
    </form>
  );
}
