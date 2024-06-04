"use client";

import { addFriend } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Contact, User } from "@/lib/schema";
import { useStore } from "@/lib/stores/client-store";
import { toast } from "sonner";
import Link from "next/link";
import { UserCheck } from "lucide-react";

type Props = {
  user: User;
};

export default function FriendSearchResultClient({ user }: Props) {
  const store = useStore();
  const contact = store.contacts.find((e) => e.userId === user.id);

  return (
    <div className="mt-4 flex flex-col items-center">
      <Avatar className="self-center h-36 w-36 mb-4">
        <AvatarImage src={user.pfp} alt={`${user.pfp}'s pfp`} />
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex text-xl mb-2 gap-2.5">
        {user.username} {contact && <UserCheck />}
      </div>
      {contact ? (
        <Link href={`/chat/${contact.groupId}`}>
          <Button>Chat</Button>
        </Link>
      ) : (
        <form
          action={async () => {
            try {
              const groupId = await addFriend(user.id);
              store.addContact(
                Contact.parse({
                  type: "friend",
                  groupId,
                  pfp: user.pfp,
                  name: user.username,
                  userId: user.id,
                })
              );
            } catch (err) {
              if (err instanceof Error) {
                toast(err.message);
              }
            }
          }}
        >
          <Button>Add</Button>
        </form>
      )}
    </div>
  );
}
