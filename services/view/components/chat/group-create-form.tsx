"use client";

import { useStore } from "@/lib/stores/client-store";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multi-select";
import { Button } from "../ui/button";

export default function GroupCreateForm() {
  const store = useStore();
  const [usernames, setUsernames] = useState<string[]>([]);

  return (
    <form
      className=""
      action={async (formData) => {
        console.log(formData.get("group-name"));
        usernames.forEach((username) => {
          const contact = store.contacts.find((e) => e.name === username);
          if (contact) {
            formData.append("user-ids", contact.userId!);
          }
        });
        console.log(formData.getAll("user-ids"));
      }}
    >
      <Label htmlFor="group-name">
        Group name
        <Input id="group-name" name="group-name" autoComplete="false" />
      </Label>

      <MultiSelector values={usernames} onValuesChange={setUsernames}>
        <Label>
          <div className="mb-2">Select initial members</div>
          <MultiSelectorTrigger>
            <MultiSelectorInput />
          </MultiSelectorTrigger>
        </Label>
        <MultiSelectorContent>
          <MultiSelectorList>
            {store.contacts
              .filter((contact) => contact.type === "friend")
              .map((contact) => (
                <MultiSelectorItem key={contact.name} value={contact.name}>
                  {contact.name}
                </MultiSelectorItem>
              ))}
          </MultiSelectorList>
        </MultiSelectorContent>
      </MultiSelector>
      <Button className="flex-grow-0">Submit</Button>
    </form>
  );
}
