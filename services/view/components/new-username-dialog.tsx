"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";
import { useClientStore } from "@/lib/stores/client-store";
import { changeUsername } from "@/lib/actions";
import { useState } from "react";

export default function NewUsernameDialog() {
  const store = useClientStore();
  const [isOpen, setIsOpen] = useState(true);
  const [formError, setFormError] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pick a username</DialogTitle>
          <DialogDescription>
            {
              "Your username is what identifies you. It must be unique. You can skip this and change it later."
            }
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            const formState = await changeUsername(formData);
            if (formState.error) {
              return setFormError(formState.error);
            }
            store.setUser({
              ...store.user,
              username: formData.get("username") as string,
            });
            return setIsOpen(false);
          }}
          className="grid grid-cols-4 items-center gap-4"
        >
          <Input
            id="username"
            name="username"
            placeholder="username"
            className="col-span-3"
            autoComplete="false"
            minLength={1}
            required
          />
          <Button type="submit">Confirm</Button>
        </form>
        <div className="text-red-500 text-xs">{formError}</div>
      </DialogContent>
    </Dialog>
  );
}
