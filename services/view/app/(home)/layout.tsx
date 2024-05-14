import FriendLink from "@/components/add-friend-button";
import SignOutButton from "@/components/sign-out-button";
import ContactListServer from "@/components/contact-list-server";
import { Suspense } from "react";
import ContactListSkeleton from "@/components/skeletons/contact-list";
import { getContacts, getUserInfo } from "@/lib/stores/server-store";
import Streaming from "@/components/streaming";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // start prefetching and caching data asynchronously before rendering children components
  getUserInfo();
  getContacts();

  return (
    <div className="flex h-screen p-4 gap-4">
      <Streaming />
      <aside className="flex-none w-64 flex flex-col justify-between bg-slate-50 p-4 rounded-2xl space-y-4">
        <Suspense fallback={<ContactListSkeleton />}>
          <ContactListServer />
        </Suspense>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex-none">
            <FriendLink />
          </div>
          <div className="flex-none">
            <SignOutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-slate-50 p-4 rounded-2xl">{children}</main>
    </div>
  );
}
