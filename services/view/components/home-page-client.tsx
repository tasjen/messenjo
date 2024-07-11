"use client";

import { User } from "@/lib/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/lib/store/client";
import { Icons } from "@/components/ui/icon";
import Link from "next/link";

type Props = {
  user: User;
};

export default function HomePageClient(props: Props) {
  const store = useStore();
  const { user } = store.user.id ? store : props;
  const friendCount = store.contacts.filter(
    (contact) => contact.type === "friend"
  ).length;
  const groupCount = store.contacts.length - friendCount;
  return (
    <div className="flex flex-col h-full">
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
      <div className="ml-auto mt-auto p-2">
        Messenjo v0.0.1
        <Link href="https://github.com/tasjen/messenjo">
          <Icons.gitHub className="inline w-4 h-4 mb-1 ml-2" />
        </Link>
      </div>
    </div>
  );
}
