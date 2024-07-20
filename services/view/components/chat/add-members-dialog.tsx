"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { chatClient } from "@/lib/grpc-clients/web";
import { parse as uuidParse } from "uuid";
import { useStore } from "@/lib/store/client";
import { Label } from "../ui/label";
import { MultiSelect } from "../ui/multi-select";
import { FriendContact } from "@/lib/schema";
import { useMemberOptions } from "@/lib/hook";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AddMembersDialog({ isOpen, setIsOpen }: Props) {
  const [userIds, setUserIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const store = useStore();
  const options = useMemberOptions();

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (!store.currentContact) return;
    try {
      await chatClient.addMembers({
        groupId: uuidParse(store.currentContact.groupId),
        userIds: userIds.map((id) => uuidParse(id)),
      });
    } catch (err) {}
  }

  if (!store.currentContact) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add members</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col space-y-8 mt-2">
          <Label>
            <div className="mb-2 flex gap-2">
              <div>Select members</div>
            </div>
            <MultiSelect
              options={options}
              selected={userIds}
              onChange={setUserIds}
            />
          </Label>
          <div className="flex justify-between items-end">
            <span className="text-red-500 text-xs">{errorMessage}</span>
            <Button
              onClick={() => setIsOpen(false)}
              disabled={userIds.length === 0}
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
