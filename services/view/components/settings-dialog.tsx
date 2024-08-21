"use client";

import { ThemeSwitch } from "./theme-switch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { chatClient } from "@/lib/grpc-clients/web";
import { ConnectError } from "@connectrpc/connect";
import clsx from "clsx";
import { useState, useEffect, FormEvent } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store/client";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function SettingsDialog({ isOpen, setIsOpen }: Props) {
  const store = useStore();
  const [username, setUsername] = useState("");
  const [pfp, setPfp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!store.user) return;
    setUsername(store.user.username);
    setPfp(store.user.pfp);
  }, [store.user]);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    try {
      await chatClient.updateUser({ username, pfp });
      store.setUser({ ...store.user, username, pfp });
      toast("Your profile has been successfully updated");
      setIsOpen(false);
    } catch (err) {
      setErrorMessage(
        err instanceof ConnectError
          ? err.rawMessage
          : err instanceof Error
            ? err.message
            : String(err)
      );
    }
  }

  if (username == null || pfp == null) {
    return <></>;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(change) => {
        setIsOpen(change);
        setUsername(store.user.username);
        setPfp(store.user.pfp);
        setErrorMessage("");
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Label className="my-4">
            <div className="mb-2">Username</div>
            <Input
              autoComplete="off"
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
              required
            />
          </Label>
          <Label>
            <div className="mb-2 flex gap-2">
              <div>Profile picture</div>
              <div className="text-muted-foreground">(optional)</div>
            </div>
            <div className="flex gap-2 items-center">
              <Avatar className="self-center h-20 w-20">
                <AvatarImage src={pfp} alt="pfp preview" />
                <AvatarFallback className={clsx(username !== "" && "text-3xl")}>
                  {username[0] ?? "preview"}
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
          <Label className="mt-4 flex gap-3 items-center">
            <span>Dark mode</span>
            <ThemeSwitch />
          </Label>
          <div className="flex justify-between items-end">
            <span className="text-red-500 text-xs">{errorMessage}</span>
            <Button
              className="self-end"
              type="submit"
              disabled={
                username === store.user.username && pfp === store.user.pfp
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
