"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { useStore } from "@/lib/store/client";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import NoSSR from "./no-ssr";
import { chatClient } from "@/lib/grpc-clients/web";
import { ConnectError } from "@connectrpc/connect";

export default function NewUsernameDialog() {
  const store = useStore();
  const [isOpen, setIsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState(store.user.username);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    try {
      await chatClient.updateUser({ username, pfp: store.user.pfp });
      store.setUser({ ...store.user, username });
      toast(`Your username has been changed to ${username}`);
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

  return (
    <NoSSR>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose your username</DialogTitle>
            <DialogDescription>
              {"Your username is your unique identifier. "}
              {"You can skip this step and change it later."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-4 items-center gap-4"
          >
            <Input
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
              placeholder="username"
              className="col-span-3"
              autoComplete="off"
              required
            />
            <Button type="submit">Confirm</Button>
          </form>
          <div className="text-red-500 text-xs">{errorMessage}</div>
        </DialogContent>
      </Dialog>
    </NoSSR>
  );
}
