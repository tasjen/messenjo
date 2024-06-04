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
import { setUsername } from "@/lib/actions";
import { useState } from "react";

type Props = {
  isNewUser: boolean;
};

export default function NewUsernameDialog({ isNewUser }: Props) {
  const store = useStore();
  const [isOpen, setIsOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    const formState = await setUsername(formData);
    if (formState.error) {
      return setErrorMessage(formState.error);
    }
    store.setUsername(formData.get("username") as string);
    return setIsOpen(false);
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
