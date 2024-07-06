"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { chatClient } from "@/lib/grpc-clients/web";
import { useStore } from "@/lib/store/client";
import { useParams, useRouter } from "next/navigation";
import { FriendContact } from "@/lib/schema";
import { parse as uuidParse } from "uuid";
import { handleWebError } from "@/lib/util";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UnfriendDialog({ isOpen, setIsOpen }: Props) {
  const store = useStore((s) => s);
  const params = useParams<{ groupId: string }>();
  const router = useRouter();
  const friend = store.contacts.find(
    (contact) => contact.groupId === params.groupId && contact.type === "friend"
  ) as FriendContact;

  async function handleUnfriend(): Promise<void> {
    try {
      await chatClient.unfriend({ toUserId: uuidParse(friend.userId) });
      store.removeContact(friend.groupId);
      router.push("/");
    } catch (err) {
      handleWebError(err);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            All the chat history between you and{" "}
            <span className="text-primary font-bold">{friend.name}</span> will
            be gone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex justify-center gap-4">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleUnfriend}
            >
              Unfriend
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
