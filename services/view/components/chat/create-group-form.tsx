"use client";

import { useStore } from "@/lib/stores/client-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";
import { FriendContact, GroupContact } from "@/lib/schema";
import { createGroup } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateGroupForm() {
  const store = useStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [pfp, setPfp] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(): Promise<void> {
    try {
      const groupId = await createGroup(groupName, pfp, selected);
      const createdGroup = GroupContact.parse({
        type: "group",
        groupId,
        name: groupName,
        pfp,
        memberCount: selected.length + 1,
      });
      store.addContact(createdGroup);
      toast(
        `Group ${createdGroup.name} (${createdGroup.memberCount}) has been created`,
        {
          action: {
            label: "Chat",
            onClick: () => router.push(`/chat/${groupId}`),
          },
        }
      );
      setSelected([]);
      setGroupName("");
      setPfp("");
      setErrMessage("");
    } catch (err) {
      if (err instanceof Error) {
        setErrMessage(err.message);
      }
    }
  }

  const options = store.contacts
    .filter((contact): contact is FriendContact => contact.type === "friend")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((contact) => ({
      img: contact.pfp,
      value: contact.userId,
      label: contact.name,
    }));

  return (
    <form className="flex flex-col space-y-8" action={handleSubmit}>
      <Label>
        <div className="mb-2 font-bold">Group name</div>
        <Input
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
              {groupName ? groupName[0] : "preview"}
            </AvatarFallback>
          </Avatar>
          <Input
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
      <div className="text-red-500 text-xs">{errMessage}</div>
    </form>
  );
}
