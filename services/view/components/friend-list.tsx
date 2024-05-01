"use client";

import { Contact } from "@/lib/data";
import { toDateFormat } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  friends: Contact[];
};

export default function FriendList(props: Props) {
  const [friends, setFriends] = useState(props.friends);
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-2">
      {friends
        .filter((e) => e.lastContent !== "")
        .sort((a, b) => b.lastSentAt - a.lastSentAt)
        .map((e) => (
          <li
            key={e.groupId}
            className={clsx("bg-gray-200 rounded-md p-2", {
              "bg-sky-100": pathname === `/chat/${e.groupId}`,
            })}
          >
            <Link href={`/chat/${e.groupId}`}>
              <div className="flex">
                <div className="font-bold text-ellipsis w-40 overflow-hidden">
                  {e.name}
                </div>
                {/* this component must be forced to render on the client */}
                <LastSentAt date={e.lastSentAt} />
              </div>
              <div className="text-sm">{e.lastContent}</div>
            </Link>
          </li>
        ))}
    </ul>
  );
}

function LastSentAt({ date }: { date: number }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <div className="ml-auto text-xs self-center">
        {toDateFormat(date)[date < Date.now() - 24 * 60 * 60 * 1000 ? 0 : 1]}
      </div>
    )
  );
}
