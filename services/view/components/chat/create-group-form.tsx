"use client";

import { useStore } from "@/lib/store/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";
import { GroupContact } from "@/lib/schema";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { chatClient } from "@/lib/grpc-clients/web";
import { ConnectError } from "@connectrpc/connect";
import { useMemberOptions } from "@/lib/hook";

export default function CreateGroupForm() {
  const store = useStore();
  const [userIds, setUserIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [pfp, setPfp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const options = useMemberOptions();

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    try {
      const { groupId } = await chatClient.createGroup({
        groupName,
        pfp,
        userIds: userIds.map((id) => uuidParse(id)),
      });
      const groupIdString = uuidStringify(groupId);
      const createdGroup = GroupContact.parse({
        type: "group",
        groupId: groupIdString,
        name: groupName,
        pfp,
        memberCount: userIds.length + 1,
      });
      store.addContact(createdGroup);
      toast(
        `Group ${createdGroup.name} (${createdGroup.memberCount}) has been created`,
        {
          action: {
            label: "Chat",
            onClick: () => router.push(`/chat/${groupIdString}`),
          },
        }
      );
      setUserIds([]);
      setGroupName("");
      setPfp("");
      setErrorMessage("");
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
    <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
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
              {groupName[0] ?? "preview"}
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
          selected={userIds}
          onChange={setUserIds}
        />
      </Label>
      <Button className="flex-grow-0">Submit</Button>
      <div className="text-red-500 text-xs">{errorMessage}</div>
    </form>
  );
}
