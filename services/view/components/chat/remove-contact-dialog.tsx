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
import { useRouter } from "next/navigation";
import { parse as uuidParse } from "uuid";
import { handleWebError } from "@/lib/util";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function RemoveContactDialog({ isOpen, setIsOpen }: Props) {
  const store = useStore();
  const router = useRouter();
  const contact = store.currentContact;

  if (!contact) return <></>;

  const handleRemoveContact = async (): Promise<void> => {
    try {
      switch (contact.type) {
        case "friend":
          await chatClient.unfriend({ toUserId: uuidParse(contact.userId) });
          break;
        case "group":
          await chatClient.leaveGroup({ groupId: uuidParse(contact.groupId) });
          break;
        default:
      }
      store.removeContact(contact.groupId);
      router.replace("/");
    } catch (err) {
      handleWebError(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            {contact.type === "friend" ? (
              <span>
                All the chat history between you and{" "}
                <span className="text-primary font-bold">{contact.name}</span>{" "}
                will be gone.
              </span>
            ) : (
              <span>
                {"You're leaving"}{" "}
                <span className="text-primary font-bold">{contact.name}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex justify-center gap-4">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleRemoveContact}
            >
              {contact.type === "friend" ? "Unfriend" : "Leave"}
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
