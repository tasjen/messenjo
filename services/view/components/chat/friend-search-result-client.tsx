"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FriendContact, User } from "@/lib/schema";
import { useStore } from "@/lib/store/client";
import Link from "next/link";
import { UserCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { parse as uuidParse, stringify as uuidStringify } from "uuid";
import { chatClient } from "@/lib/grpc-clients/web";
import { handleWebError } from "@/lib/util";

type Props = {
  user: User;
};

export default function FriendSearchResultClient({ user }: Props) {
  const store = useStore((s) => s);

  // for preventing the previous search result from showing up even if there is no `q` searchParam
  const searchParams = useSearchParams();
  if (!searchParams.get("q")) {
    return <></>;
  }

  const contact = store.contacts.find(
    (contact) => (contact as FriendContact).userId === user.id
  );

  function handleAddFriend() {
    chatClient
      .addFriend({
        toUserId: uuidParse(user.id),
      })
      .then(({ groupId }) =>
        store.addContact(
          FriendContact.parse({
            type: "friend",
            groupId: uuidStringify(groupId),
            pfp: user.pfp,
            name: user.username,
            userId: user.id,
          })
        )
      )
      .catch(handleWebError);
  }

  return (
    <div className="mt-4 flex flex-col items-center">
      <Avatar className="self-center h-48 w-48 mb-4">
        <AvatarImage src={user.pfp} alt={`${user.pfp}'s pfp`} />
        <AvatarFallback>{user.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex text-2xl mb-2 gap-4 items-center">
        {user.username} {contact && <UserCheck className="w-6 h-6" />}
      </div>
      {user.id === store.user.id ? (
        <div>You</div>
      ) : contact ? (
        <Link href={`/chat/${contact.groupId}`}>
          <Button>Chat</Button>
        </Link>
      ) : (
        <Button onClick={handleAddFriend}>Add</Button>
      )}
    </div>
  );
}
