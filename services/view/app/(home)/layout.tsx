import FriendLink from "@/components/add-friend-button";
import SignOutButton from "@/components/sign-out-button";
import FriendList from "@/components/friend-list";
import { fetchContacts } from "@/lib/data";
import { session } from "@/lib/utils";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = session(headers());
  const friends = await fetchContacts(userId);
  return (
    <div className="flex h-screen p-4 gap-4">
      <aside className="flex-none w-64 h-full flex flex-col justify-between bg-slate-50 p-4 rounded-2xl">
        <FriendList friends={friends} />
        <div className="flex flex-col gap-2 items-center">
          <div className="flex-none">
            <FriendLink />
          </div>
          <div className="flex-none">
            <SignOutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col bg-slate-50 p-4 rounded-2xl">
        {children}
      </main>
    </div>
  );
}
