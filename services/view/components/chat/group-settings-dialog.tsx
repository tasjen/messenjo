"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store/client";
import { GroupContact } from "@/lib/schema";
import { toast } from "sonner";
import { chatClient } from "@/lib/grpc-clients/web";
import { parse as uuidParse } from "uuid";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function GroupSettingsDialog({ isOpen, setIsOpen }: Props) {
  const store = useStore();
  const currentSettings = store.currentContact as GroupContact;
  const [name, setName] = useState("");
  const [pfp, setPfp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!currentSettings) return;
    setName(currentSettings.name);
    setPfp(currentSettings.pfp);
  }, [currentSettings]);

  if (!currentSettings) return <></>;

  const handleSubmit = async (): Promise<void> => {
    try {
      await chatClient.updateGroup({
        groupId: uuidParse(currentSettings.groupId),
        name,
        pfp,
      });
      const updatedGroup: GroupContact = {
        ...currentSettings,
        name: name,
        pfp,
      };
      store.setGroup(updatedGroup);
      toast("The group has been updated");
      setIsOpen(false);
      setErrorMessage("");
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(change) => {
        setIsOpen(change);
        setName(currentSettings.name);
        setPfp(currentSettings.pfp);
        setErrorMessage("");
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Group settings</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col" action={handleSubmit}>
          <Label className="my-4">
            <div className="mb-2">Group name</div>
            <Input
              autoComplete="off"
              value={name}
              onChange={({ target: { value } }) => setName(value)}
            />
          </Label>
          <Label>
            <div className="mb-2 flex gap-2">
              <div>Group profile picture</div>
              <div className="text-muted-foreground">(optional)</div>
            </div>
            <div className="flex gap-2 items-center">
              <Avatar className="self-center h-20 w-20">
                <AvatarImage src={pfp} alt="pfp preview" />
                <AvatarFallback className={clsx(name !== "" && "text-3xl")}>
                  {name ? name[0] : "preview"}
                </AvatarFallback>
              </Avatar>
              <Input
                placeholder="Image URL"
                autoComplete="off"
                value={pfp}
                onChange={({ target: { value } }) => setPfp(value)}
              />
            </div>
          </Label>
          <div className="flex justify-between items-end">
            <span className="text-red-500 text-xs">{errorMessage}</span>
            <Button
              className="self-end"
              type="submit"
              disabled={
                name === currentSettings.name && pfp === currentSettings.pfp
              }
            >
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
