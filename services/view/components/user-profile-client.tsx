"use client";

import { useStore } from "@/lib/store/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/schema";

type Props = {
  user: User;
};

export default function UserProfileClient(props: Props) {
  const store = useStore();
  const { user } = store.user.id ? store : props;
  const friendCount = store.contacts.filter(
    (contact) => contact.type === "friend"
  ).length;
  const groupCount = store.contacts.length - friendCount;

  return (
    <div className="mt-auto space-y-4">
      <Avatar className="h-28 w-28 mx-auto">
        <AvatarImage src={user.pfp} alt="your pfp" />
        <AvatarFallback>{user.username[0]}</AvatarFallback>
      </Avatar>
      <div className="text-3xl text-center">{user.username}</div>
      <div className="text-ring text-center">
        friends: {friendCount} | groups: {groupCount}
      </div>
    </div>
  );
}
