"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { chatClient } from "@/lib/grpc-clients/web";
import { useStore } from "@/lib/store/client";
import { ThemeSwitch } from "./theme-switch";
import { ConnectError } from "@connectrpc/connect";

export default function SettingsButton() {
  const store = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [pfp, setPfp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!store.user) return;
    setUsername(store.user.username);
    setPfp(store.user.pfp);
  }, [store.user]);

  async function handleSubmit(): Promise<void> {
    try {
      await chatClient.updateUser({ username, pfp });
      store.setUser({ ...store.user, username, pfp });
      toast("Your profile has been successfully updated");
      setIsOpen(false);
    } catch (err) {
      if (err instanceof ConnectError) {
        setErrorMessage(err.rawMessage);
      }
    }
  }

  if (!username || !pfp) {
    return (
      <Button variant="secondary">
        <Settings />
      </Button>
    );
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
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col" action={handleSubmit}>
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
