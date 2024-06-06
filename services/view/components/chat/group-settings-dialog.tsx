"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";
import { Button } from "../ui/button";
import { useStore } from "@/lib/stores/client-store";
import { useParams } from "next/navigation";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function GroupSettingsDialog({ isOpen, setIsOpen }: Props) {
  const store = useStore();
  const params = useParams<{ groupId: string }>();
  const currentSettings = store.contacts.find(
    (contact) => contact.groupId === params.groupId
  )!;
  const [groupName, setGroupName] = useState(currentSettings.name);
  const [pfp, setPfp] = useState(currentSettings.pfp);
  const [errMessage, setErrMessage] = useState("");

  async function handleSubmit(): Promise<void> {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Group settings</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col space-y-4" action={handleSubmit}>
          <Label>
            <div className="mb-2 font-bold">Group name</div>
            <Input
              id="group-name"
              name="group-name"
              autoComplete="off"
              value={groupName}
              onChange={({ target }) => setGroupName(target.value)}
            />
          </Label>
          <Label>
            <div className="mb-2 flex gap-2">
              <div className="font-bold">Group profile picture</div>
              <div className="text-muted-foreground">(optional)</div>
            </div>
            <div className="flex gap-2 items-center">
              <Avatar className="self-center h-20 w-20">
                <AvatarImage src={pfp} alt="pfp preview" />
                <AvatarFallback
                  className={clsx(groupName !== "" && "text-3xl")}
                >
                  {groupName ? groupName[0] : "preview"}
                </AvatarFallback>
              </Avatar>
              <Input
                id="pfp"
                name="pfp"
                placeholder="Image URL"
                autoComplete="off"
                value={pfp}
                onChange={({ target }) => setPfp(target.value)}
              />
            </div>
          </Label>
          <Button className="self-end">Save changes</Button>
          <div className="text-red-500 text-xs">{errMessage}</div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
