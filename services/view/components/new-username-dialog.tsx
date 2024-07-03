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
import { useState } from "react";
import { toast } from "sonner";
import NoSSR from "./no-ssr";
import { chatClient } from "@/lib/grpc-clients/web";

export default function NewUsernameDialog() {
  const store = useStore((s) => s);
  const [isOpen, setIsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState(store.user.username);

  async function handleSubmit(): Promise<void> {
    try {
      await chatClient.updateUser({ username, pfp: store.user.pfp });
      store.setUser({ ...store.user, username });
      toast(`Your username has been changed to ${username}`, {
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
      setIsOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
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
            action={handleSubmit}
            className="grid grid-cols-4 items-center gap-4"
          >
            <Input
              value={username}
              onChange={({ target: { value } }) => setUsername(value)}
              placeholder="username"
              className="col-span-3"
              autoComplete="off"
              minLength={1}
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
