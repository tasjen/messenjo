"use client";

import { useStore } from "@/lib/stores/client-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";
import type { FriendContact } from "@/lib/schema";

export default function CreateGroupForm() {
  const store = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [pfp, setPfp] = useState("");
  const [groupName, setGroupName] = useState("");

  const options = store.contacts
    .filter((contact): contact is FriendContact => contact.type === "friend")
    .map((contact) => ({
      img: contact.pfp,
      value: contact.userId,
      label: contact.name,
    }));

  return (
    <form
      className="flex flex-col space-y-2"
      action={async (formData) => {
        console.log(formData.get("group-name"));
        selected.forEach((userId) => {
          formData.append("user-ids", userId);
        });
        console.log(formData.getAll("user-ids"));
      }}
    >
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
            <AvatarFallback className={clsx(groupName !== "" && "text-3xl")}>
              {groupName ? groupName[0].toUpperCase() : "preview"}
            </AvatarFallback>
          </Avatar>
          <Input
            id="group-name"
            name="group-name"
            placeholder="Image URL"
            autoComplete="off"
            value={pfp}
            onChange={({ target }) => setPfp(target.value)}
          />
        </div>
      </Label>
      <Label>
        <div className="mb-2 flex gap-2">
          <div className="font-bold">Initial members</div>
          <div className="text-muted-foreground">(optional)</div>
        </div>
        <MultiSelect
          options={options}
          selected={selected}
          onChange={setSelected}
        />
      </Label>
      <Button className="flex-grow-0">Submit</Button>
    </form>
  );
}
