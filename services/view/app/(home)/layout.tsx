import FriendLink from "@/components/add-friend-button";
import SignOutButton from "@/components/sign-out-button";
import ContactListServer from "@/components/contact-list-server";
import { Suspense } from "react";
import ContactListSkeleton from "@/components/skeletons/contact-list";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen p-4 gap-4">
      <aside className="flex-none w-64 h-full flex flex-col justify-between bg-slate-50 p-4 rounded-2xl">
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
      <main className="flex-1 flex flex-col bg-slate-50 p-4 rounded-2xl">
        {children}
      </main>
    </div>
  );
}
