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
import { useStore } from "@/lib/stores/client-store";
import { updateUser } from "@/lib/actions";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  isNewUser: boolean;
};

export default function NewUsernameDialog({ isNewUser }: Props) {
  const store = useStore();
  const [isOpen, setIsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData): Promise<void> {
    try {
      formData.set("pfp", store.user.pfp);
      await updateUser(formData);
      const username = formData.get("username") as string;
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose your username</DialogTitle>
          <DialogDescription>
            {"Your username is your unique identifier. "}
            {isNewUser && "You can skip this step and change it later."}
          </DialogDescription>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="grid grid-cols-4 items-center gap-4"
        >
          <Input
            id="username"
            name="username"
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
  );
}
