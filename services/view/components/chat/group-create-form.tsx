"use client";

import { useStore } from "@/lib/stores/client-store";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { MultiSelect } from "../ui/multi-select";
import { Button } from "../ui/button";

export default function GroupCreateForm() {
  const store = useStore();
  const [selected, setSelected] = useState<string[]>([]);

  const options = store.contacts
    .filter((contact) => contact.type === "friend")
    .map((contact) => ({
      value: contact.userId!,
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
      <Label htmlFor="group-name">
        <div className="mb-2">Group name</div>
        <Input id="group-name" name="group-name" autoComplete="off" />
      </Label>
      <Label>
        <div className="mb-2">Select initial members</div>
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
