import ChatBoardSkeleton from "@/components/skeletons/chat-board";
import ChatFormSkeleton from "@/components/skeletons/chat-form";

export default function Loading() {
  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <ChatBoardSkeleton />
      <ChatFormSkeleton />
    </div>
  );
}
